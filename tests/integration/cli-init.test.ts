import { describe, it, expect, beforeEach, afterEach } from "vitest"
import fs from "fs/promises"
import path from "path"
import os from "os"
import { runInit } from "../../src/cli/init"

describe("ui-navigation-map init", () => {
  let tmpDir: string

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "unm-test-"))
  })

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true })
  })

  it("should create wireframes directory with all required files", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir })

    // Check directory structure
    const stat = await fs.stat(wireframesDir)
    expect(stat.isDirectory()).toBe(true)

    const screensStat = await fs.stat(path.join(wireframesDir, "screens"))
    expect(screensStat.isDirectory()).toBe(true)
  })

  it("should scaffold public/ directory with sample asset", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir })

    const publicStat = await fs.stat(path.join(wireframesDir, "public"))
    expect(publicStat.isDirectory()).toBe(true)

    const svgExists = await fs.access(path.join(wireframesDir, "public/github.svg")).then(() => true).catch(() => false)
    expect(svgExists).toBe(true)
  })

  it("should scaffold all screen files", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir })

    const files = await fs.readdir(path.join(wireframesDir, "screens"))
    expect(files).toContain("Explore.tsx")
    expect(files).toContain("Issues.tsx")
    expect(files).toContain("Profile.tsx")
    expect(files).toContain("Pullrequest.tsx")
    expect(files).toContain("Repo.tsx")
    expect(files).toContain("Notifications.tsx")
  })

  it("should scaffold flows.ts", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir })

    const flowsContent = await fs.readFile(path.join(wireframesDir, "flows.ts"), "utf-8")
    expect(flowsContent).toContain("NavigationMapConfig")
    expect(flowsContent).toContain("screens")
    expect(flowsContent).toContain("edges")
  })

  it("should scaffold unm.theme.ts", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir })

    const themeContent = await fs.readFile(path.join(wireframesDir, "unm.theme.ts"), "utf-8")
    expect(themeContent).toContain("NavigationMapTheme")
    expect(themeContent).toContain("colors")
    expect(themeContent).toContain("primary")
  })

  it("should scaffold CLAUDE.md", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir })

    const claudeContent = await fs.readFile(path.join(wireframesDir, "CLAUDE.md"), "utf-8")
    expect(claudeContent).toContain("UI Navigation Map")
    expect(claudeContent).toContain("screens")
  })

  it("should respect custom --dir flag", async () => {
    const customDir = path.join(tmpDir, "my-design")
    await runInit({ dir: customDir })

    const stat = await fs.stat(customDir)
    expect(stat.isDirectory()).toBe(true)

    const files = await fs.readdir(path.join(customDir, "screens"))
    expect(files.length).toBeGreaterThan(0)
  })

  it("should throw error if directory already exists", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await fs.mkdir(wireframesDir, { recursive: true })

    await expect(runInit({ dir: wireframesDir })).rejects.toThrow()
  })

  it("should generate styles.css with Tailwind v4 @theme inline when --tailwind flag is set", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir, tailwind: true })

    const content = await fs.readFile(path.join(wireframesDir, "styles.css"), "utf-8")
    expect(content).toContain('@import "tailwindcss"')
    expect(content).toContain("@theme inline {")
    expect(content).toContain("--color-primary")
    expect(content).toContain("var(--unm-primary)")
  })

  it("should generate styles.css by default", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir })

    const content = await fs.readFile(path.join(wireframesDir, "styles.css"), "utf-8")
    expect(content).toContain('@import "tailwindcss"')
  })

  it("should not generate styles.css when tailwind is false", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir, tailwind: false })

    const exists = await fs.access(path.join(wireframesDir, "styles.css")).then(() => true).catch(() => false)
    expect(exists).toBe(false)
  })

  it("should not generate tailwind.config.ts even with --tailwind", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir, tailwind: true })

    const exists = await fs.access(path.join(wireframesDir, "tailwind.config.ts")).then(() => true).catch(() => false)
    expect(exists).toBe(false)
  })

  it("should scaffold Tailwind-class screens when --tailwind flag is set", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir, tailwind: true })

    const content = await fs.readFile(path.join(wireframesDir, "screens/Explore.tsx"), "utf-8")
    expect(content).toContain("className=")
  })

  it("should scaffold Tailwind-class screens by default", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir })

    const content = await fs.readFile(path.join(wireframesDir, "screens/Explore.tsx"), "utf-8")
    expect(content).toContain("className=")
  })

  it("should scaffold inline-style screens when tailwind is false", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir, tailwind: false })

    const content = await fs.readFile(path.join(wireframesDir, "screens/Explore.tsx"), "utf-8")
    expect(content).toContain("style={")
    expect(content).not.toContain("className=")
  })

  it("should scaffold package.json with private and type module", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir })

    const content = await fs.readFile(path.join(wireframesDir, "package.json"), "utf-8")
    const pkg = JSON.parse(content)
    expect(pkg.private).toBe(true)
    expect(pkg.type).toBe("module")
  })

  it("should scaffold .gitignore with node_modules", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir })

    const content = await fs.readFile(path.join(wireframesDir, ".gitignore"), "utf-8")
    expect(content).toContain("node_modules/")
  })

  it("should include default project name in scaffolded flows.ts", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir })

    const flowsContent = await fs.readFile(path.join(wireframesDir, "flows.ts"), "utf-8")
    expect(flowsContent).toContain('name: "My Navigation Map"')
  })

  it("should use custom project name when --name is provided", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir, name: "Cool App" })

    const flowsContent = await fs.readFile(path.join(wireframesDir, "flows.ts"), "utf-8")
    expect(flowsContent).toContain('name: "Cool App"')
    expect(flowsContent).not.toContain("My Navigation Map")
  })
})

describe("ui-navigation-map init — AI agent convention files", () => {
  let tmpDir: string

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "unm-test-"))
  })

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true })
  })

  async function scaffold() {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir })
    return wireframesDir
  }

  async function readFileIfExists(dir: string, file: string): Promise<string | null> {
    try {
      return await fs.readFile(path.join(dir, file), "utf-8")
    } catch {
      return null
    }
  }

  it("should scaffold AGENTS.md", async () => {
    const dir = await scaffold()
    const content = await readFileIfExists(dir, "AGENTS.md")
    expect(content).not.toBeNull()
    expect(content).toContain("UI Navigation Map")
    expect(content).toContain("data-unm-navigate")
  })

  it("should scaffold CLAUDE.md with the same content as AGENTS.md", async () => {
    const dir = await scaffold()
    const agents = await readFileIfExists(dir, "AGENTS.md")
    const claude = await readFileIfExists(dir, "CLAUDE.md")
    expect(claude).not.toBeNull()
    expect(claude).toBe(agents)
  })

  it("should scaffold GEMINI.md for Gemini CLI / Antigravity", async () => {
    const dir = await scaffold()
    const content = await readFileIfExists(dir, "GEMINI.md")
    expect(content).not.toBeNull()
    expect(content).toContain("UI Navigation Map")
  })

  it("should scaffold Cursor rules with alwaysApply frontmatter", async () => {
    const dir = await scaffold()
    const content = await readFileIfExists(dir, ".cursor/rules/ui-navigation-map.mdc")
    expect(content).not.toBeNull()
    expect(content).toContain("---")
    expect(content).toContain("alwaysApply: true")
    expect(content).toContain("data-unm-navigate")
  })

  it("should scaffold GitHub Copilot instructions", async () => {
    const dir = await scaffold()
    const content = await readFileIfExists(dir, ".github/copilot-instructions.md")
    expect(content).not.toBeNull()
    expect(content).toContain("UI Navigation Map")
  })

  it("should scaffold Windsurf rules", async () => {
    const dir = await scaffold()
    const content = await readFileIfExists(dir, ".windsurf/rules/ui-navigation-map.md")
    expect(content).not.toBeNull()
    expect(content).toContain("UI Navigation Map")
  })

  it("should scaffold Cline rules", async () => {
    const dir = await scaffold()
    const content = await readFileIfExists(dir, ".clinerules")
    expect(content).not.toBeNull()
    expect(content).toContain("UI Navigation Map")
  })

  it("should scaffold Roo Code rules", async () => {
    const dir = await scaffold()
    const content = await readFileIfExists(dir, ".roo/rules/ui-navigation-map.md")
    expect(content).not.toBeNull()
    expect(content).toContain("UI Navigation Map")
  })
})
