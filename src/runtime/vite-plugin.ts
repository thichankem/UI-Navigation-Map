import type { Plugin } from "vite"
import type { IncomingMessage, ServerResponse } from "http"
import path from "path"
import fs from "fs/promises"
import { scanScreens, extractNavigationTargets } from "./screen-scanner"
import { updateScreenPosition, updateScreenViewport, updateScreenColor, writeFlowConfig } from "./flow-writer"
import { resolvePackageRoot } from "./paths"
// Lazy import to avoid loading vite build API in test environments
let _runExport: typeof import("../cli/export").runExport | undefined
import type { NavigationMapConfig, Viewport } from "../types"

const __pkgRoot = resolvePackageRoot()

export interface UiNavigationMapPluginOptions {
  dir: string
}

const VIRTUAL_THEME = "virtual:unm/theme"
const VIRTUAL_SCREENS = "virtual:unm/screens"
const VIRTUAL_INFERRED_EDGES = "virtual:unm/inferred-edges"
const RESOLVED_THEME = "\0" + VIRTUAL_THEME
const RESOLVED_SCREENS = "\0" + VIRTUAL_SCREENS
const RESOLVED_INFERRED_EDGES = "\0" + VIRTUAL_INFERRED_EDGES

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = ""
    req.on("data", (chunk: Buffer) => { body += chunk.toString() })
    req.on("end", () => resolve(body))
    req.on("error", reject)
  })
}

function sendJson(res: ServerResponse, status: number, payload: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json" })
  res.end(JSON.stringify(payload))
}

type ApiHandler = (body: Record<string, any>) => Promise<void>

/**
 * Single middleware that routes POST /__unm/* update requests
 * to their handlers. Non-matching requests fall through to next().
 */
function createApiMiddleware(handlers: Record<string, ApiHandler>) {
  return (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (req.method !== "POST" || !req.url) return next()
    const handler = handlers[req.url]
    if (!handler) return next()

    readBody(req)
      .then(async (raw) => {
        await handler(raw ? JSON.parse(raw) : {})
        sendJson(res, 200, { ok: true })
      })
      .catch((err) => sendJson(res, 500, { error: String(err) }))
  }
}

export function uiNavigationMapPlugin(options: UiNavigationMapPluginOptions): Plugin {
  const { dir } = options
  let suppressNextFlowsReload = false

  return {
    name: "ui-navigation-map",

    handleHotUpdate({ file }) {
      const flowsPath = path.resolve(dir, "flows.ts")
      if (file === flowsPath && suppressNextFlowsReload) {
        suppressNextFlowsReload = false
        return []
      }
    },

    resolveId(id: string) {
      if (id === VIRTUAL_THEME) return RESOLVED_THEME
      if (id === VIRTUAL_SCREENS) return RESOLVED_SCREENS
      if (id === VIRTUAL_INFERRED_EDGES) return RESOLVED_INFERRED_EDGES
      return undefined
    },

    async load(id: string) {
      if (id === RESOLVED_THEME) {
        const themePath = path.resolve(dir, "unm.theme.ts").replace(/\\/g, "/")
        const themeLoaderPath = path.resolve(__pkgRoot, "src/runtime/theme-loader").replace(/\\/g, "/")
        return `
          import theme from "${themePath}"
          import { generateThemeCSS } from "${themeLoaderPath}"
          const css = generateThemeCSS(theme)
          const style = document.createElement("style")
          style.setAttribute("data-unm-theme", "")
          style.textContent = css
          document.head.appendChild(style)
        `
      }

      if (id === RESOLVED_SCREENS) {
        const screensDir = path.resolve(dir, "screens")
        const screens = await scanScreens(screensDir)
        const imports = screens
          .map((s, i) => `import Screen${i} from "${s.filePath.replace(/\\/g, "/")}"`)
          .join("\n")
        const entries = screens
          .map((s, i) => `  "${s.id}": Screen${i}`)
          .join(",\n")
        return `${imports}\nexport default {\n${entries}\n}`
      }

      if (id === RESOLVED_INFERRED_EDGES) {
        const screensDir = path.resolve(dir, "screens")
        const screens = await scanScreens(screensDir)
        const edges: Array<{ from: string; to: string; label: string; inferred: true }> = []

        for (const screen of screens) {
          try {
            const source = await fs.readFile(screen.filePath, "utf-8")
            const targets = extractNavigationTargets(source)
            for (const target of targets) {
              edges.push({ from: screen.id, to: target, label: "navigate", inferred: true })
            }
          } catch {
            // Skip unreadable files
          }
        }

        return `export default ${JSON.stringify(edges)}`
      }

      return undefined
    },

    configureServer(server) {
      const screensDir = path.resolve(dir, "screens")
      const themePath = path.resolve(dir, "unm.theme.ts")
      const flowsPath = path.resolve(dir, "flows.ts")

      server.watcher.add([screensDir, themePath])
      // Prevent page reload when export writes a temp index.html
      server.watcher.unwatch(path.resolve(dir, "index.html"))

      function invalidateAndReload(changedPath: string) {
        if (changedPath.startsWith(screensDir) || changedPath === themePath) {
          const themeModule = server.moduleGraph.getModuleById(RESOLVED_THEME)
          const screensModule =
            server.moduleGraph.getModuleById(RESOLVED_SCREENS)
          const inferredEdgesModule =
            server.moduleGraph.getModuleById(RESOLVED_INFERRED_EDGES)

          if (themeModule) {
            server.moduleGraph.invalidateModule(themeModule)
          }
          if (screensModule) {
            server.moduleGraph.invalidateModule(screensModule)
          }
          if (inferredEdgesModule) {
            server.moduleGraph.invalidateModule(inferredEdgesModule)
          }

          server.ws.send({ type: "full-reload" })
        }
      }

      server.watcher.on("change", invalidateAndReload)
      server.watcher.on("add", invalidateAndReload)
      server.watcher.on("unlink", invalidateAndReload)

      // Helper: load flows.ts config via Vite's SSR transform (handles .ts files)
      async function loadFlowsConfig(): Promise<NavigationMapConfig> {
        // Invalidate cached module so we always get fresh content
        const mods = server.moduleGraph.getModulesByFile(flowsPath)
        if (mods) {
          for (const m of mods) server.moduleGraph.invalidateModule(m)
        }
        const flowsModule = await server.ssrLoadModule(flowsPath)
        return flowsModule.default
      }

      async function persistConfig(mutate: (config: NavigationMapConfig) => NavigationMapConfig): Promise<void> {
        const config = await loadFlowsConfig()
        // Write back to flows.ts (suppress HMR reload for this save)
        suppressNextFlowsReload = true
        await writeFlowConfig(flowsPath, mutate(config))
      }

      // API middleware for screen config persistence (positions, viewport, color)
      server.middlewares.use(
        createApiMiddleware({
          "/__unm/update-positions": async (body) => {
            const { positions } = body as { positions: Record<string, { x: number; y: number }> }
            await persistConfig((config) => {
              let next = config
              for (const [screenId, position] of Object.entries(positions)) {
                next = updateScreenPosition(next, screenId, position)
              }
              return next
            })
          },
          "/__unm/update-viewport": async (body) => {
            const { screenId, viewport } = body as { screenId: string; viewport: Viewport }
            await persistConfig((config) => updateScreenViewport(config, screenId, viewport))
          },
          "/__unm/update-color": async (body) => {
            const { screenId, color } = body as { screenId: string; color: string }
            await persistConfig((config) => updateScreenColor(config, screenId, color))
          },
        }),
      )

      // API middleware for static HTML export
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.url !== "/__unm/export" || req.method !== "POST") {
          return next()
        }

        ;(async () => {
          // Export to project root (parent of wireframes dir)
          const projectRoot = path.dirname(path.resolve(dir))
          const outputPath = path.join(projectRoot, "ui-navigation-map.html")

          if (!_runExport) {
            const mod = await import("../cli/export")
            _runExport = mod.runExport
          }
          await _runExport({ dir, output: outputPath, silent: true })

          sendJson(res, 200, { ok: true, path: outputPath })
        })().catch((err: any) => {
          sendJson(res, 500, { error: String(err) })
        })
      })
    },
  }
}