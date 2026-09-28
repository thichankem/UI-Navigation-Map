import { describe, it, expect } from "vitest"
import path from "path"
import { scanScreens, extractNavigationTargets } from "../../src/runtime/screen-scanner"

const fixturesDir = path.resolve(__dirname, "../fixtures/sample-screens")

describe("scanScreens", () => {
  it("should find all .tsx files in a directory", async () => {
    const screens = await scanScreens(fixturesDir)
    const filenames = screens.map((s) => s.filename)
    expect(filenames).toContain("SimpleScreen.tsx")
    expect(filenames).toContain("NavigatingScreen.tsx")
  })

  it("should ignore non-.tsx files", async () => {
    const screens = await scanScreens(fixturesDir)
    const filenames = screens.map((s) => s.filename)
    expect(filenames).not.toContain("not-a-screen.txt")
  })

  it("should return screen id derived from filename in lowercase", async () => {
    const screens = await scanScreens(fixturesDir)
    const ids = screens.map((s) => s.id)
    expect(ids).toContain("simplescreen")
    expect(ids).toContain("navigatingscreen")
  })

  it("should include full file paths", async () => {
    const screens = await scanScreens(fixturesDir)
    const simpleScreen = screens.find((s) => s.id === "simplescreen")
    expect(simpleScreen?.filePath).toBe(path.join(fixturesDir, "SimpleScreen.tsx"))
  })

  it("should return empty array for empty directory", async () => {
    const emptyDir = path.resolve(__dirname, "../fixtures/empty-screens")
    // Create the empty dir if it doesn't exist
    const fs = await import("fs/promises")
    await fs.mkdir(emptyDir, { recursive: true })
    const screens = await scanScreens(emptyDir)
    expect(screens).toEqual([])
  })
})

describe("extractNavigationTargets", () => {
  it("should extract data-unm-navigate values from source", () => {
    const source = `
      <button data-unm-navigate="dashboard">Go</button>
      <a data-unm-navigate="settings">Settings</a>
    `
    const targets = extractNavigationTargets(source)
    expect(targets).toContain("dashboard")
    expect(targets).toContain("settings")
  })

  it("should return empty array when no navigation attributes", () => {
    const source = `<div>No navigation</div>`
    const targets = extractNavigationTargets(source)
    expect(targets).toEqual([])
  })

  it("should handle single quotes", () => {
    const source = `<button data-unm-navigate='profile'>Profile</button>`
    const targets = extractNavigationTargets(source)
    expect(targets).toContain("profile")
  })

  it("should deduplicate targets", () => {
    const source = `
      <button data-unm-navigate="dashboard">Go 1</button>
      <button data-unm-navigate="dashboard">Go 2</button>
    `
    const targets = extractNavigationTargets(source)
    expect(targets).toHaveLength(1)
    expect(targets).toContain("dashboard")
  })
})
