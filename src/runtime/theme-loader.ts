import type { NavigationMapTheme } from "../types"

function camelToKebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
}

export function generateThemeCSS(theme: Partial<NavigationMapTheme>): string {
  const props: string[] = []

  if (theme.colors) {
    for (const [key, value] of Object.entries(theme.colors)) {
      props.push(`  --unm-${camelToKebab(key)}: ${value};`)
    }
  }

  if (theme.radius) {
    for (const [key, value] of Object.entries(theme.radius)) {
      props.push(`  --unm-radius-${camelToKebab(key)}: ${value};`)
    }
  }

  if (theme.spacing) {
    for (const [key, value] of Object.entries(theme.spacing)) {
      props.push(`  --unm-spacing-${camelToKebab(key)}: ${value};`)
    }
  }

  if (theme.typography) {
    const { fontFamily, heading, body } = theme.typography
    if (fontFamily) {
      props.push(`  --unm-font-family: ${fontFamily};`)
    }
    if (heading) {
      props.push(`  --unm-heading-weight: ${heading.weight};`)
      if (heading.sizes) {
        for (const [key, value] of Object.entries(heading.sizes)) {
          props.push(`  --unm-heading-${camelToKebab(key)}: ${value};`)
        }
      }
    }
    if (body) {
      props.push(`  --unm-body-weight: ${body.weight};`)
      if (body.sizes) {
        for (const [key, value] of Object.entries(body.sizes)) {
          props.push(`  --unm-body-${camelToKebab(key)}: ${value};`)
        }
      }
    }
  }

  if (theme.shadows) {
    for (const [key, value] of Object.entries(theme.shadows)) {
      props.push(`  --unm-shadow-${camelToKebab(key)}: ${value};`)
    }
  }

  let css = `:root {\n${props.join("\n")}\n}`

  if (theme.darkColors) {
    const darkProps: string[] = []
    for (const [key, value] of Object.entries(theme.darkColors)) {
      if (value != null) {
        darkProps.push(`  --unm-${camelToKebab(key)}: ${value};`)
      }
    }
    if (darkProps.length > 0) {
      css += `\n\n[data-unm-color-scheme="dark"] {\n${darkProps.join("\n")}\n}`
    }
  }

  return css
}

export function generateThemeFile(theme: NavigationMapTheme): string {
  return `import type { NavigationMapTheme } from "ui-navigation-map"

const theme: NavigationMapTheme = ${JSON.stringify(theme, null, 2)}

export default theme
`
}

export function generateTailwindCSS(theme: NavigationMapTheme): string {
  const lines: string[] = []

  // Colors → --color-<kebab>: var(--unm-<kebab>)
  for (const key of Object.keys(theme.colors)) {
    const kebab = camelToKebab(key)
    lines.push(`  --color-${kebab}: var(--unm-${kebab});`)
  }

  // Radius → --radius-<key>: var(--unm-radius-<key>)
  for (const key of Object.keys(theme.radius)) {
    lines.push(`  --radius-${key}: var(--unm-radius-${key});`)
  }

  // Spacing → --spacing-<key>: var(--unm-spacing-<key>)
  for (const key of Object.keys(theme.spacing)) {
    lines.push(`  --spacing-${key}: var(--unm-spacing-${key});`)
  }

  // Font → --font-sans: var(--unm-font-family)
  lines.push(`  --font-sans: var(--unm-font-family);`)

  // Shadows → --shadow-<key>: var(--unm-shadow-<key>)
  for (const key of Object.keys(theme.shadows)) {
    lines.push(`  --shadow-${key}: var(--unm-shadow-${key});`)
  }

  return `@import "tailwindcss";\n@source "./screens";\n\n@theme inline {\n${lines.join("\n")}\n}\n`
}
