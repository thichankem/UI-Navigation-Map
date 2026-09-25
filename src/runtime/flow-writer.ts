import fs from "fs/promises"
import type { NavigationMapConfig, Viewport } from "../types"

export function updateScreenPosition(
  config: NavigationMapConfig,
  screenId: string,
  position: { x: number; y: number },
): NavigationMapConfig {
  if (!config.screens[screenId]) return config

  return {
    ...config,
    screens: {
      ...config.screens,
      [screenId]: {
        ...config.screens[screenId],
        position,
      },
    },
  }
}

export function updateScreenColor(
  config: NavigationMapConfig,
  screenId: string,
  color: string,
): NavigationMapConfig {
  if (!config.screens[screenId]) return config

  return {
    ...config,
    screens: {
      ...config.screens,
      [screenId]: {
        ...config.screens[screenId],
        color,
      },
    },
  }
}

export function updateScreenViewport(
  config: NavigationMapConfig,
  screenId: string,
  viewport: Viewport,
): NavigationMapConfig {
  if (!config.screens[screenId]) return config

  return {
    ...config,
    screens: {
      ...config.screens,
      [screenId]: {
        ...config.screens[screenId],
        viewport,
      },
    },
  }
}

export function serializeFlowConfig(config: NavigationMapConfig): string {
  const screenEntries = Object.entries(config.screens)
    .map(([id, screen]) => {
      const fields = [
        `      title: "${screen.title}"`,
        `      file: "${screen.file}"`,
        `      position: { x: ${screen.position.x}, y: ${screen.position.y} }`,
      ]
      if (screen.viewport) {
        fields.push(`      viewport: "${screen.viewport}"`)
      }
      if (screen.color) {
        fields.push(`      color: "${screen.color}"`)
      }
      return `    ${id}: {\n${fields.join(",\n")},\n    }`
    })
    .join(",\n")

  const edgeEntries = (config.edges || [])
    .map((edge) => {
      const fields = [`from: "${edge.from}"`, `to: "${edge.to}"`]
      if (edge.label) fields.push(`label: "${edge.label}"`)
      return `    { ${fields.join(", ")} }`
    })
    .join(",\n")

  const nameField = config.name ? `  name: "${config.name}",\n` : ""

  return `import type { NavigationMapConfig } from "ui-navigation-map"

const config: NavigationMapConfig = {
${nameField}  screens: {
${screenEntries},
  },

  edges: [
${edgeEntries},
  ],
}

export default config
`
}

export async function writeFlowConfig(filePath: string, config: NavigationMapConfig): Promise<void> {
  const source = serializeFlowConfig(config)
  await fs.writeFile(filePath, source, "utf-8")
}
