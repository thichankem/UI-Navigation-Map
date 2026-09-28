// @vitest-environment node
import { describe, it, expect } from "vitest"
import { buildDevHtml } from "../../src/cli/dev"

describe("buildDevHtml — exportMode", () => {
  it("should include exportMode: true in render call when exportMode is true", () => {
    const html = buildDevHtml({ hasStylesCSS: false, exportMode: true })
    expect(html).toContain("exportMode: true")
  })

  it("should not include exportMode when exportMode is false or omitted", () => {
    const html = buildDevHtml({ hasStylesCSS: false })
    expect(html).not.toContain("exportMode")
  })

  it("should still include title and styles link when exportMode is true", () => {
    const html = buildDevHtml({ hasStylesCSS: true, projectName: "Test", exportMode: true })
    expect(html).toContain("<title>Test — UI Navigation Map</title>")
    expect(html).toContain("styles.css")
  })
})
