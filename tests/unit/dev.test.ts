// @vitest-environment node
import { describe, it, expect } from "vitest"
import { buildDevHtml } from "../../src/cli/dev"

describe("buildDevHtml", () => {
  it("should not contain styles.css when hasStylesCSS is false", () => {
    const html = buildDevHtml({ hasStylesCSS: false })
    expect(html).not.toContain("styles.css")
  })

  it("should contain styles.css link when hasStylesCSS is true", () => {
    const html = buildDevHtml({ hasStylesCSS: true })
    expect(html).toContain("styles.css")
    expect(html).toContain('<link rel="stylesheet" href="/styles.css" />')
  })

  it("should always contain virtual:unm/theme", () => {
    const htmlWithout = buildDevHtml({ hasStylesCSS: false })
    const htmlWith = buildDevHtml({ hasStylesCSS: true })
    expect(htmlWithout).toContain("virtual:unm/theme")
    expect(htmlWith).toContain("virtual:unm/theme")
  })

  it("should be a valid HTML document", () => {
    const html = buildDevHtml({ hasStylesCSS: false })
    expect(html).toContain("<!DOCTYPE html>")
    expect(html).toContain("<html")
    expect(html).toContain("</html>")
    expect(html).toContain('<div id="root">')
  })

  it("should use project name in title when provided", () => {
    const html = buildDevHtml({ hasStylesCSS: false, projectName: "My App" })
    expect(html).toContain("<title>My App — UI Navigation Map</title>")
  })

  it("should use plain UI Navigation Map title when no project name", () => {
    const html = buildDevHtml({ hasStylesCSS: false })
    expect(html).toContain("<title>UI Navigation Map</title>")
  })
})
