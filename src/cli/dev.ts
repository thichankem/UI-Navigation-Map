import fs from "fs"
import path from "path"
import { createServer } from "vite"
import tailwindcss from "@tailwindcss/vite"
import { uiNavigationMapPlugin } from "../runtime/vite-plugin"
import { buildCoreAliases, linkFilesystemDeps } from "./resolve"
import { resolvePackageRoot, resolveAppPath } from "../runtime/paths"
import { readProjectName } from "../runtime/flow-reader"

export interface DevOptions {
  dir: string
  port: number
}

export function buildDevHtml(opts: { hasStylesCSS: boolean; projectName?: string; exportMode?: boolean }): string {
  const stylesLink = opts.hasStylesCSS
    ? `\n  <link rel="stylesheet" href="/styles.css" />`
    : ""
  const title = opts.projectName ? `${opts.projectName} — UI Navigation Map` : "UI Navigation Map"

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%234488ff'/><text x='16' y='22' font-size='16' font-weight='700' fill='white' text-anchor='middle' font-family='system-ui'>un</text></svg>" />
  <style>
    @layer base {
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: Inter, system-ui, sans-serif; }
    }
  </style>${stylesLink}
</head>
<body>
  <div id="root"></div>
  <script type="module">
    import "virtual:unm/theme"
    import { createRoot } from "react-dom/client"
    import { createElement } from "react"
    import { App } from "/@unm/app"
    import config from "/flows.ts"
    import screensModule from "virtual:unm/screens"
    import inferredEdgesModule from "virtual:unm/inferred-edges"

    const screens = screensModule.default || screensModule
    const inferredEdges = inferredEdgesModule.default || inferredEdgesModule
    const root = createRoot(document.getElementById("root"))
    root.render(createElement(App, { config: config.default || config, screens, inferredEdges${opts.exportMode ? ", exportMode: true" : ""} }))
  </script>
</body>
</html>`
}

export async function runDev(options: DevOptions): Promise<void> {
  const { dir, port } = options
  const resolvedDir = path.resolve(dir)

  // Validate wireframes directory exists
  if (!fs.existsSync(resolvedDir)) {
    throw new Error(
      `Wireframes directory not found: ${resolvedDir}\nRun "ui-navigation-map init --dir ${dir}" first.`,
    )
  }

  const pkgRoot = resolvePackageRoot()
  const appPath = resolveAppPath()

  // Auto-detect styles.css for Tailwind support
  const hasStylesCSS = fs.existsSync(path.join(resolvedDir, "styles.css"))

  const projectName = readProjectName(path.join(resolvedDir, "flows.ts"))

  const html = buildDevHtml({ hasStylesCSS, projectName })

  // Map core packages to ui-navigation-map's bundled copies so user-installed
  // packages in wireframes/node_modules don't cause duplicate React, etc.
  const coreAliases = buildCoreAliases()

  // Create per-package symlinks for deps that non-Vite resolvers need
  // from the filesystem (e.g. tailwindcss for @tailwindcss/vite)
  const cleanupDeps = linkFilesystemDeps(resolvedDir)
  process.on("exit", cleanupDeps)
  process.on("SIGINT", () => { cleanupDeps(); process.exit() })
  process.on("SIGTERM", () => { cleanupDeps(); process.exit() })

  const server = await createServer({
    root: resolvedDir,
    esbuild: {
      jsx: "automatic",
    },
    resolve: {
      alias: coreAliases,
    },
    plugins: [
      tailwindcss(),
      uiNavigationMapPlugin({ dir: resolvedDir }),
      {
        name: "unm-html",
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === "/" || req.url === "/index.html") {
              // Transform HTML through Vite's plugin pipeline
              const transformed = await server.transformIndexHtml(
                req.url,
                html,
              )
              res.statusCode = 200
              res.setHeader("Content-Type", "text/html")
              res.end(transformed)
              return
            }
            next()
          })
        },
        resolveId(id) {
          if (id === "/@unm/app") return "\0@ui-navigation-map/app"
        },
        load(id) {
          if (id === "\0@ui-navigation-map/app") {
            return `export { App } from "${appPath}"`
          }
        },
      },
    ],
    server: {
      port,
      fs: {
        allow: [resolvedDir, pkgRoot, ...Object.values(coreAliases)],
      },
    },
  })

  await server.listen()
  server.printUrls()
}
