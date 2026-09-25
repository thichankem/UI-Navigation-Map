import fs from "fs/promises"
import path from "path"
import { generateTailwindCSS } from "../runtime/theme-loader"
import { DEFAULT_THEME } from "../runtime/default-theme"
import { resolveTemplatesDir } from "../runtime/paths"
import { DEFAULT_PROJECT_NAME } from "../types"

export interface InitOptions {
  dir: string
  tailwind?: boolean
  name?: string
}

const CURSOR_RULE_FRONTMATTER = `---
description: UI Navigation Map wireframe canvas conventions
alwaysApply: true
---`

/**
 * AI agent convention files generated from the canonical AGENTS.md.
 * AGENTS.md itself is copied as-is (the cross-agent standard used by
 * Codex, Antigravity, Amp, Zed, opencode, and others).
 */
const AGENT_CONVENTION_FILES: Array<{ dest: string; transform?: (content: string) => string }> = [
  { dest: "CLAUDE.md" },
  { dest: "GEMINI.md" },
  { dest: ".cursor/rules/ui-navigation-map.mdc", transform: (c) => `${CURSOR_RULE_FRONTMATTER}\n${c}` },
  { dest: ".github/copilot-instructions.md" },
  { dest: ".windsurf/rules/ui-navigation-map.md" },
  { dest: ".clinerules" },
  { dest: ".roo/rules/ui-navigation-map.md" },
]

export async function runInit(options: InitOptions): Promise<void> {
  const { dir, tailwind = true } = options

  // Check if directory already exists
  try {
    await fs.access(dir)
    throw new Error(`Directory already exists: ${dir}`)
  } catch (err: any) {
    if (err.code !== "ENOENT") throw err
  }

  // Find templates directory (works from both src/ and dist/)
  const templatesDir = resolveTemplatesDir()

  // Create directory structure
  await fs.mkdir(path.join(dir, "screens"), { recursive: true })
  await fs.mkdir(path.join(dir, "public"), { recursive: true })

  // Copy template files
  const screenDir = tailwind ? "screens-tailwind" : "screens"
  // Discover screen files dynamically from the template directory
  const screenFiles = (await fs.readdir(path.join(templatesDir, screenDir)))
    .filter((f) => f.endsWith(".tsx"))
  const filesToCopy = [
    ...screenFiles.map((f) => ({ src: `${screenDir}/${f}`, dest: `screens/${f}` })),
    { src: "flows.ts", dest: "flows.ts" },
    { src: "unm.theme.ts", dest: "unm.theme.ts" },
    { src: "AGENTS.md", dest: "AGENTS.md" },
    { src: "README.md", dest: "README.md" },
    { src: "public/github.svg", dest: "public/github.svg" },
  ]

  for (const file of filesToCopy) {
    const srcPath = path.join(templatesDir, file.src)
    const destPath = path.join(dir, file.dest)
    await fs.copyFile(srcPath, destPath)
  }

  // Generate AI agent convention files from the canonical AGENTS.md
  const agentsContent = await fs.readFile(path.join(templatesDir, "AGENTS.md"), "utf-8")
  for (const file of AGENT_CONVENTION_FILES) {
    const destPath = path.join(dir, file.dest)
    await fs.mkdir(path.dirname(destPath), { recursive: true })
    await fs.writeFile(destPath, file.transform ? file.transform(agentsContent) : agentsContent)
  }

  // Create package.json so users can npm-install their own packages
  await fs.writeFile(
    path.join(dir, "package.json"),
    JSON.stringify({ private: true, type: "module" }, null, 2) + "\n",
  )

  // Create .gitignore to exclude user-installed node_modules
  await fs.writeFile(path.join(dir, ".gitignore"), "node_modules/\n")

  // Replace project name in flows.ts if --name was provided
  if (options.name) {
    const flowsPath = path.join(dir, "flows.ts")
    const flowsContent = await fs.readFile(flowsPath, "utf-8")
    await fs.writeFile(flowsPath, flowsContent.replace(DEFAULT_PROJECT_NAME, options.name))
  }

  // Generate styles.css with Tailwind v4 @theme block if requested
  if (tailwind) {
    await fs.writeFile(path.join(dir, "styles.css"), generateTailwindCSS(DEFAULT_THEME))
  }
}