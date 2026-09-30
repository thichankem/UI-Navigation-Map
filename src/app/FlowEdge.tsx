import { BaseEdge, getSmoothStepPath } from "@xyflow/react"
import type { EdgeProps, Edge } from "@xyflow/react"
import type { LineStyle } from "../types"

/**
 * Custom data payload attached to FlowEdge instances.
 */
export type FlowEdgeData = {
  /** Optional descriptive label of the transition */
  label?: string
  /** Whether this edge was automatically inferred from screen code */
  inferred?: boolean
  /** Custom accent color tint */
  accentColor?: string
  /** Stroke dash style */
  lineStyle?: LineStyle
}

/**
 * Strongly-typed Edge specification for UI Navigation Map flows.
 */
export type FlowEdgeType = Edge<FlowEdgeData, "flow">

/**
 * Dash pattern configurations mapped to line style presets.
 */
const DASH_ARRAY_MAP: Record<LineStyle, string | undefined> = {
  solid: undefined,
  dashed: "6 3",
  dotted: "2 2",
}

/**
 * FlowEdge renders an organic, smooth step connection arrow between screens.
 *
 * Capabilities:
 * - Smooth right-angle routing between intelligent connection handles.
 * - Solid, dashed, or dotted stroke patterns.
 * - Dimmed opacity (40%) and default dash array for inferred transitions.
 * - Custom accent tinting matching canvas themes.
 */
export function FlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<FlowEdgeType>) {
  // Compute smooth orthogonal step path between handles
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  const isInferred = data?.inferred === true
  const accentColor = data?.accentColor ?? "#94a3b8"
  const lineStyle = data?.lineStyle ?? "solid"

  // Derive SVG stroke styles
  const edgeStyle = isInferred
    ? {
        stroke: accentColor,
        strokeWidth: 1.5,
        strokeDasharray: DASH_ARRAY_MAP[lineStyle] ?? "6 3",
        opacity: 0.4,
      }
    : {
        stroke: accentColor,
        strokeWidth: 1.5,
        strokeDasharray: DASH_ARRAY_MAP[lineStyle],
      }

  return <BaseEdge id={id} path={edgePath} style={edgeStyle} />
}
