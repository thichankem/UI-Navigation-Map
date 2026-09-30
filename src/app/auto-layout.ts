import type { NavigationMapConfig, EdgeConfig, Viewport } from "../types"
import { getScreenResolution } from "../types"

/** Maximum thumbnail dimension in pixels on the canvas */
const THUMBNAIL_MAX_DIM = 420

/** Approximate height of the node's top control pill bar */
const PILL_BAR_HEIGHT = 46

/** Inner canvas node padding */
const NODE_PADDING = 8

/** Horizontal separation between layout columns */
const COLUMN_GAP = 160

/** Vertical separation between rows within the same layer */
const ROW_GAP = 80

interface NodeDimension {
  width: number
  height: number
}

/**
 * Calculates the bounding box of a screen node on the canvas,
 * accounting for thumbnail scaling and the controls pill bar.
 *
 * @param viewport - Optional device viewport preset
 * @returns Width and height of the rendered node card
 */
function getNodeSize(viewport?: Viewport): NodeDimension {
  const { width, height } = getScreenResolution(viewport)
  const scale = THUMBNAIL_MAX_DIM / Math.max(width, height)
  return {
    width: Math.round(width * scale) + NODE_PADDING * 2,
    height: Math.round(height * scale) + PILL_BAR_HEIGHT + NODE_PADDING * 2,
  }
}

/**
 * Computes a clean, aesthetic horizontal DAG layout for wireframe screens.
 *
 * Algorithmic steps:
 * 1. Filter out invalid/self edges.
 * 2. Prioritize explicit user-defined edges; fallback to inferred navigation edges.
 * 3. Calculate topological layer assignment via iterated longest-path relaxation.
 * 4. Cluster screens by layer and compute cumulative horizontal offsets.
 * 5. Vertically center all rows within each column around y = 0.
 *
 * @param config - Current navigation map configuration
 * @param inferredEdges - Automatically detected code navigation links
 * @returns Map of screenId to its target { x, y } coordinate
 */
export function computeAutoLayout(
  config: NavigationMapConfig,
  inferredEdges: EdgeConfig[] = [],
): Record<string, { x: number; y: number }> {
  const screenIds = Object.keys(config.screens)
  if (screenIds.length === 0) {
    return {}
  }

  // Filter valid directed edges between existing screens
  const sanitizeEdges = (
    list: EdgeConfig[],
  ): Array<{ from: string; to: string }> =>
    list.filter(
      (edge) =>
        edge.from !== edge.to &&
        Boolean(config.screens[edge.from]) &&
        Boolean(config.screens[edge.to]),
    )

  const explicitEdges = sanitizeEdges(config.edges ?? [])
  const fallbackEdges = sanitizeEdges(inferredEdges)
  // Curated explicit flows dictate layout; inferred edges provide fallback
  const activeEdges = explicitEdges.length > 0 ? explicitEdges : fallbackEdges

  // Assign layers via longest path (bounded by node count to tolerate cycles)
  const layerMap: Record<string, number> = {}
  for (const id of screenIds) {
    layerMap[id] = 0
  }

  for (let iteration = 0; iteration < screenIds.length; iteration++) {
    let hasChanges = false
    for (const edge of activeEdges) {
      const candidateLayer = layerMap[edge.from] + 1
      if (candidateLayer > layerMap[edge.to]) {
        layerMap[edge.to] = candidateLayer
        hasChanges = true
      }
    }
    if (!hasChanges) {
      break
    }
  }

  // Partition screen IDs into layers, maintaining insertion order
  const layerGroups: string[][] = []
  for (const id of screenIds) {
    const l = layerMap[id]
    if (!layerGroups[l]) {
      layerGroups[l] = []
    }
    layerGroups[l].push(id)
  }

  // Calculate cumulative X offsets for each column based on max column width
  const xOffsets: number[] = []
  let cumulativeX = 0
  for (let l = 0; l < layerGroups.length; l++) {
    const group = layerGroups[l]
    if (!group) continue
    xOffsets[l] = cumulativeX
    const colWidth = Math.max(
      ...group.map((id) => getNodeSize(config.screens[id].viewport).width),
    )
    cumulativeX += colWidth + COLUMN_GAP
  }

  // Assign final coordinates centered vertically
  const result: Record<string, { x: number; y: number }> = {}

  for (let l = 0; l < layerGroups.length; l++) {
    const group = layerGroups[l]
    if (!group) continue

    const heights = group.map(
      (id) => getNodeSize(config.screens[id].viewport).height,
    )
    const maxHeight = Math.max(...heights)
    const rowHeight = maxHeight + ROW_GAP
    const totalGroupHeight = (group.length - 1) * rowHeight + maxHeight
    const startY = -totalGroupHeight / 2

    group.forEach((id, index) => {
      result[id] = {
        x: Math.round(xOffsets[l]),
        y: Math.round(startY + index * rowHeight),
      }
    })
  }

  return result
}
