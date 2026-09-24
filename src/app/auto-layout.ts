import type { NavigationMapConfig, EdgeConfig, Viewport } from "../types"
import { getScreenResolution } from "../types"

const THUMBNAIL_MAX_DIM = 420
const PILL_BAR_HEIGHT = 46
const NODE_PADDING = 8
const COLUMN_GAP = 160
const ROW_GAP = 80

interface Size {
  width: number
  height: number
}

/**
 * Approximates the on-canvas size of a screen node (thumbnail + pill bar),
 * matching the scaling used by ScreenNode.
 */
function getNodeSize(viewport?: Viewport): Size {
  const { width, height } = getScreenResolution(viewport)
  const scale = THUMBNAIL_MAX_DIM / Math.max(width, height)
  return {
    width: Math.round(width * scale) + NODE_PADDING * 2,
    height: Math.round(height * scale) + PILL_BAR_HEIGHT + NODE_PADDING * 2,
  }
}

/**
 * Computes a tidy layered layout for all screens, flowing left-to-right
 * along the directed edges. Explicit edges (the curated flow) drive the
 * layering; inferred edges are only used when no explicit edges exist,
 * since inferred edges often include back-navigation that would push
 * entry screens to the far right. Cycles are tolerated (layers saturate
 * after N iterations).
 *
 * Returns a map of screenId → absolute position.
 */
export function computeAutoLayout(
  config: NavigationMapConfig,
  inferredEdges: EdgeConfig[] = [],
): Record<string, { x: number; y: number }> {
  const ids = Object.keys(config.screens)
  if (ids.length === 0) return {}

  const collect = (list: EdgeConfig[]): Array<{ from: string; to: string }> =>
    list.filter(
      (edge) =>
        edge.from !== edge.to &&
        config.screens[edge.from] &&
        config.screens[edge.to],
    )

  const explicitEdges = collect(config.edges ?? [])
  const fallbackEdges = collect(inferredEdges)
  const edges = explicitEdges.length > 0 ? explicitEdges : fallbackEdges

  // Longest-path layering, iterated until stable (capped to survive cycles).
  const layer: Record<string, number> = {}
  for (const id of ids) layer[id] = 0
  for (let i = 0; i < ids.length; i++) {
    let changed = false
    for (const edge of edges) {
      const next = layer[edge.from] + 1
      if (next > layer[edge.to]) {
        layer[edge.to] = next
        changed = true
      }
    }
    if (!changed) break
  }

  // Group node ids by layer, preserving config insertion order.
  const groups: string[][] = []
  for (const id of ids) {
    const l = layer[id]
    if (!groups[l]) groups[l] = []
    groups[l].push(id)
  }

  // Column x-offsets accumulate the widest node in each preceding column.
  const xOffsets: number[] = []
  let acc = 0
  for (let l = 0; l < groups.length; l++) {
    const group = groups[l]
    if (!group) continue
    xOffsets[l] = acc
    const columnWidth = Math.max(...group.map((id) => getNodeSize(config.screens[id].viewport).width))
    acc += columnWidth + COLUMN_GAP
  }

  const layout: Record<string, { x: number; y: number }> = {}

  for (let l = 0; l < groups.length; l++) {
    const group = groups[l]
    if (!group) continue
    const heights = group.map((id) => getNodeSize(config.screens[id].viewport).height)
    const maxHeight = Math.max(...heights)
    const rowHeight = maxHeight + ROW_GAP
    const totalHeight = (group.length - 1) * rowHeight + maxHeight
    const startY = -totalHeight / 2

    group.forEach((id, i) => {
      layout[id] = {
        x: Math.round(xOffsets[l]),
        y: Math.round(startY + i * rowHeight),
      }
    })
  }

  return layout
}