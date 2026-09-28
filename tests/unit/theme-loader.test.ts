import { describe, it, expect } from "vitest"
import { generateThemeCSS, generateThemeFile, generateTailwindCSS } from "../../src/runtime/theme-loader"
import { sampleTheme } from "../fixtures/sample-theme"

describe("generateThemeCSS", () => {
  it("should generate CSS custom properties from a full theme", () => {
    const css = generateThemeCSS(sampleTheme)
    expect(css).toContain(":root {")
    expect(css).toContain("}")
  })

  it("should generate color properties with --unm- prefix", () => {
    const css = generateThemeCSS(sampleTheme)
    expect(css).toContain("--unm-primary: #2563EB;")
    expect(css).toContain("--unm-secondary: #7C3AED;")
    expect(css).toContain("--unm-background: #FFFFFF;")
    expect(css).toContain("--unm-text: #0F172A;")
    expect(css).toContain("--unm-text-muted: #64748B;")
    expect(css).toContain("--unm-text-invert: #FFFFFF;")
    expect(css).toContain("--unm-surface-alt: #F1F5F9;")
  })

  it("should generate radius properties", () => {
    const css = generateThemeCSS(sampleTheme)
    expect(css).toContain("--unm-radius-sm: 4px;")
    expect(css).toContain("--unm-radius-md: 8px;")
    expect(css).toContain("--unm-radius-full: 9999px;")
  })

  it("should generate spacing properties", () => {
    const css = generateThemeCSS(sampleTheme)
    expect(css).toContain("--unm-spacing-xs: 4px;")
    expect(css).toContain("--unm-spacing-md: 16px;")
    expect(css).toContain("--unm-spacing-xxl: 48px;")
  })

  it("should generate typography properties", () => {
    const css = generateThemeCSS(sampleTheme)
    expect(css).toContain("--unm-font-family: Inter, system-ui, sans-serif;")
    expect(css).toContain("--unm-heading-weight: 600;")
    expect(css).toContain("--unm-heading-h1: 2rem;")
    expect(css).toContain("--unm-heading-h2: 1.5rem;")
    expect(css).toContain("--unm-body-weight: 400;")
    expect(css).toContain("--unm-body-base: 1rem;")
    expect(css).toContain("--unm-body-sm: 0.875rem;")
  })

  it("should generate shadow properties", () => {
    const css = generateThemeCSS(sampleTheme)
    expect(css).toContain("--unm-shadow-sm: 0 1px 2px rgba(0,0,0,0.05);")
    expect(css).toContain("--unm-shadow-md: 0 4px 6px rgba(0,0,0,0.07);")
  })

  it("should generate dark color overrides scoped to data-unm-color-scheme", () => {
    const css = generateThemeCSS(sampleTheme)
    expect(css).toContain('[data-unm-color-scheme="dark"]')
    expect(css).toContain("--unm-background: #0F172A;")
    expect(css).toContain("--unm-surface: #1E293B;")
    expect(css).toContain("--unm-text: #F1F5F9;")
    expect(css).toContain("--unm-text-muted: #94A3B8;")
  })

  it("should not generate dark block when darkColors is absent", () => {
    const { darkColors, ...themeWithoutDark } = sampleTheme
    const css = generateThemeCSS(themeWithoutDark)
    expect(css).not.toContain('[data-unm-color-scheme="dark"]')
  })

  it("should handle partial theme with only colors", () => {
    const partial = { colors: { primary: "#000", secondary: "#111", accent: "#222", background: "#fff", surface: "#eee", surfaceAlt: "#ddd", border: "#ccc", text: "#333", textMuted: "#666", textInvert: "#fff", success: "#0f0", warning: "#ff0", error: "#f00", info: "#00f" } } as any
    const css = generateThemeCSS(partial)
    expect(css).toContain("--unm-primary: #000;")
    expect(css).not.toContain("--unm-radius")
  })
})

describe("generateThemeFile", () => {
  it("should generate a valid TypeScript file with theme export", () => {
    const file = generateThemeFile(sampleTheme)
    expect(file).toContain('import type { NavigationMapTheme } from "ui-navigation-map"')
    expect(file).toContain("const theme: NavigationMapTheme =")
    expect(file).toContain("export default theme")
  })

  it("should include all theme colors in the output", () => {
    const file = generateThemeFile(sampleTheme)
    expect(file).toContain('"primary"')
    expect(file).toContain('"#2563EB"')
    expect(file).toContain('"secondary"')
  })

  it("should include radius values", () => {
    const file = generateThemeFile(sampleTheme)
    expect(file).toContain('"sm"')
    expect(file).toContain('"4px"')
  })

  it("should produce parseable JSON for the theme object", () => {
    const file = generateThemeFile(sampleTheme)
    // Extract JSON from between "= " and the next newline before "export"
    const jsonStr = file.split("const theme: NavigationMapTheme = ")[1].split("\n\nexport")[0]
    const parsed = JSON.parse(jsonStr)
    expect(parsed.colors.primary).toBe("#2563EB")
    expect(parsed.radius.sm).toBe("4px")
  })
})

describe("generateTailwindCSS", () => {
  it("should start with @import tailwindcss", () => {
    const css = generateTailwindCSS(sampleTheme)
    expect(css).toMatch(/^@import "tailwindcss"/)
  })

  it("should contain @theme inline block", () => {
    const css = generateTailwindCSS(sampleTheme)
    expect(css).toContain("@theme inline {")
  })

  it("should map colors to var(--unm-*) references", () => {
    const css = generateTailwindCSS(sampleTheme)
    expect(css).toContain("--color-primary: var(--unm-primary);")
    expect(css).toContain("--color-secondary: var(--unm-secondary);")
    expect(css).toContain("--color-surface-alt: var(--unm-surface-alt);")
    expect(css).toContain("--color-text-muted: var(--unm-text-muted);")
    expect(css).toContain("--color-text-invert: var(--unm-text-invert);")
    expect(css).toContain("--color-success: var(--unm-success);")
  })

  it("should map radius to var(--unm-radius-*) references", () => {
    const css = generateTailwindCSS(sampleTheme)
    expect(css).toContain("--radius-sm: var(--unm-radius-sm);")
    expect(css).toContain("--radius-md: var(--unm-radius-md);")
    expect(css).toContain("--radius-full: var(--unm-radius-full);")
  })

  it("should map spacing to var(--unm-spacing-*) references", () => {
    const css = generateTailwindCSS(sampleTheme)
    expect(css).toContain("--spacing-xs: var(--unm-spacing-xs);")
    expect(css).toContain("--spacing-md: var(--unm-spacing-md);")
    expect(css).toContain("--spacing-xxl: var(--unm-spacing-xxl);")
  })

  it("should map font family to var(--unm-font-family)", () => {
    const css = generateTailwindCSS(sampleTheme)
    expect(css).toContain("--font-sans: var(--unm-font-family);")
  })

  it("should map shadows to var(--unm-shadow-*) references", () => {
    const css = generateTailwindCSS(sampleTheme)
    expect(css).toContain("--shadow-sm: var(--unm-shadow-sm);")
    expect(css).toContain("--shadow-md: var(--unm-shadow-md);")
    expect(css).toContain("--shadow-lg: var(--unm-shadow-lg);")
  })

  it("should not contain v3 syntax", () => {
    const css = generateTailwindCSS(sampleTheme)
    expect(css).not.toContain('import type { Config }')
    expect(css).not.toContain("content:")
    expect(css).not.toContain("theme: {")
  })
})
