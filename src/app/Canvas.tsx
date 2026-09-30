import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "@xyflow/react"
import type { Node, Edge } from "@xyflow/react"
import { useCallback, useEffect, type ComponentType } from "react"
import { ScreenNode } from "./ScreenNode"
import { FlowEdge } from "./FlowEdge"
import { Toolbar } from "./Toolbar"
import { LogoBadge } from "./LogoBadge"
import { ExportBanner } from "./ExportBanner"
import { computeAutoLayout } from "./auto-layout"
import type { NavigationMapConfig, EdgeConfig, CanvasSettings } from "../types"

/** Custom node registry for React Flow */
const NODE_TYPES = { screen: ScreenNode }

/** Custom edge registry for React Flow */
const EDGE_TYPES = { flow: FlowEdge }

/**
 * Props for the Canvas component.
 */
interface CanvasProps {
  /** Screen and navigation configuration */
  config: NavigationMapConfig
  /** Map of screen IDs to their rendered React components */
  screens?: Record<string, ComponentType>
  /** Callback fired when user selects a screen to view */
  onScreenSelect: (screenId: string) => void
  /** Screen node ID to zoom and focus upon closing the viewer */
  focusNodeId?: string | null
  /** Inferred navigation edges scanned from component source code */
  inferredEdges?: EdgeConfig[]
  /** Active canvas visual settings */
  settings?: CanvasSettings
  /** Callback to update canvas visual settings */
  onSettingsChange?: (settings: CanvasSettings) => void
  /** Project title */
  projectName?: string
  /** Whether the canvas is rendered in static export mode */
  exportMode?: boolean
}

/**
 * Converts project screen configuration into React Flow Node objects.
 */
function configToNodes(
  config: NavigationMapConfig,
  onScreenSelect: (id: string) => void,
  screens?: Record<string, ComponentType>,
  accentColor?: string,
  colorScheme?: "light" | "dark",
  projectName?: string,
  exportMode?: boolean,
): Node[] {
  return Object.entries(config.screens).map(([id, screen]) => ({
    id,
    type: "screen",
    position: screen.position,
    data: {
      title: screen.title,
      screenId: id,
      onSelect: onScreenSelect,
      component: screens?.[id],
      viewport: screen.viewport,
      color: screen.color,
      accentColor,
      colorScheme,
      projectName,
      exportMode,
    },
  }))
}

/**
 * Normalizes an unordered pair of node IDs into a consistent key
 * for bidirectional edge deduplication.
 */
function pairKey(a: string, b: string): string {
  return a < b ? `${a}:${b}` : `${b}:${a}`
}

/**
 * Selects the optimal source and target handles based on relative node positions.
 * Ensures clean horizontal or vertical orthogonal connections.
 */
function pickHandles(
  positions: Record<string, { x: number; y: number }>,
  fromId: string,
  toId: string,
): { sourceHandle: string; targetHandle: string } {
  const fromPos = positions[fromId]
  const toPos = positions[toId]
  if (!fromPos || !toPos) {
    return { sourceHandle: "source-right", targetHandle: "target-left" }
  }

  const dx = toPos.x - fromPos.x
  const dy = toPos.y - fromPos.y

  if (Math.abs(dx) >= Math.abs(dy)) {
    // Dominant horizontal direction
    if (dx >= 0) {
      return { sourceHandle: "source-right", targetHandle: "target-left" }
    }
    return { sourceHandle: "source-left", targetHandle: "target-right" }
  }

  // Dominant vertical direction
  if (dy >= 0) {
    return { sourceHandle: "source-bottom", targetHandle: "target-top" }
  }
  return { sourceHandle: "source-top", targetHandle: "target-bottom" }
}

/**
 * Extracts all node coordinates from config with optional runtime drag overrides.
 */
function getPositions(
  config: NavigationMapConfig,
  nodeOverrides?: Record<string, { x: number; y: number }>,
): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {}
  for (const [id, screen] of Object.entries(config.screens)) {
    positions[id] = nodeOverrides?.[id] ?? screen.position
  }
  return positions
}

/**
 * Merges explicit user flows and code-inferred edges into React Flow Edge objects.
 * Deduplicates opposite-direction cycles to keep wireframe flows tidy.
 */
function configToEdges(
  config: NavigationMapConfig,
  inferredEdges?: EdgeConfig[],
  settings?: CanvasSettings,
  nodePositions?: Record<string, { x: number; y: number }>,
): Edge[] {
  const positions = nodePositions ?? getPositions(config)
  const seenPairs = new Set<string>()

  // 1. Process explicit user-defined flows
  const explicitEdges: Edge[] = (config.edges ?? [])
    .filter((edge) => {
      const key = pairKey(edge.from, edge.to)
      if (seenPairs.has(key)) return false
      seenPairs.add(key)
      return true
    })
    .map((edge) => {
      const handles = pickHandles(positions, edge.from, edge.to)
      return {
        id: `${edge.from}-${edge.to}`,
        type: "flow",
        source: edge.from,
        target: edge.to,
        ...handles,
        data: {
          label: edge.label,
          accentColor: settings?.accentColor,
          lineStyle: settings?.lineStyle,
        },
      }
    })

  if (!inferredEdges?.length) {
    return explicitEdges
  }

  // 2. Add remaining inferred edges
  const inferred: Edge[] = inferredEdges
    .filter((edge) => {
      const key = pairKey(edge.from, edge.to)
      if (seenPairs.has(key)) return false
      seenPairs.add(key)
      return true
    })
    .map((edge) => {
      const handles = pickHandles(positions, edge.from, edge.to)
      return {
        id: `inferred-${edge.from}-${edge.to}`,
        type: "flow",
        source: edge.from,
        target: edge.to,
        ...handles,
        data: {
          label: edge.label,
          inferred: true,
          accentColor: settings?.accentColor,
          lineStyle: settings?.lineStyle,
        },
      }
    })

  return [...explicitEdges, ...inferred]
}

/**
 * FocusHandler smoothly animates the camera to center a target node.
 */
function FocusHandler({ focusNodeId }: { focusNodeId?: string | null }) {
  const { fitView } = useReactFlow()

  useEffect(() => {
    if (focusNodeId) {
      const timer = setTimeout(() => {
        fitView({ nodes: [{ id: focusNodeId }], duration: 300, padding: 0.5 })
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [focusNodeId, fitView])

  return null
}

/** Mapping of user background choice to React Flow BackgroundVariant */
const BG_VARIANT_MAP = {
  grid: BackgroundVariant.Lines,
  dots: BackgroundVariant.Dots,
}

/**
 * Canvas is the central infinite workspace where screens and flows are rendered.
 *
 * Responsibilities:
 * - Render scalable screen nodes with live React component thumbnails.
 * - Render directed orthogonal transition paths.
 * - MiniMap, customizable canvas background (grid/dots/blank).
 * - Drag-and-drop position persistence to backend flows.ts.
 * - One-click auto layout computation.
 */
export function Canvas({
  config,
  screens,
  onScreenSelect,
  focusNodeId,
  inferredEdges,
  settings,
  onSettingsChange,
  projectName,
  exportMode,
}: CanvasProps) {
  const initialNodes = configToNodes(
    config,
    onScreenSelect,
    screens,
    settings?.accentColor,
    settings?.appearance,
    projectName,
    exportMode,
  )
  const initialEdges = configToEdges(config, inferredEdges, settings)

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // React to canvas settings changes (accent color, line style, dark mode)
  useEffect(() => {
    setEdges(configToEdges(config, inferredEdges, settings))
    setNodes((prev) =>
      prev.map((node) => ({
        ...node,
        data: {
          ...node.data,
          accentColor: settings?.accentColor,
          colorScheme: settings?.appearance,
          projectName,
          exportMode,
        },
      })),
    )
  }, [settings?.accentColor, settings?.lineStyle, settings?.appearance, exportMode, projectName])

  // Persist node position after dragging
  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      fetch("/__unm/update-positions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          positions: { [node.id]: { x: node.position.x, y: node.position.y } },
        }),
      }).catch(() => {})

      // Recalculate edge handles with live coordinates
      setNodes((currentNodes) => {
        const livePositions: Record<string, { x: number; y: number }> = {}
        for (const n of currentNodes) {
          livePositions[n.id] = n.position
        }
        setEdges(configToEdges(config, inferredEdges, settings, livePositions))
        return currentNodes
      })
    },
    [config, inferredEdges, settings, setEdges, setNodes],
  )

  const { fitView } = useReactFlow()

  // Compute and apply automated horizontal DAG layout
  const handleAutoArrange = useCallback(() => {
    const positions = computeAutoLayout(config, inferredEdges)
    setNodes((currentNodes) => {
      const next = currentNodes.map((n) =>
        positions[n.id] ? { ...n, position: positions[n.id] } : n,
      )
      setEdges(configToEdges(config, inferredEdges, settings, positions))
      return next
    })

    fetch("/__unm/update-positions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ positions }),
    }).catch(() => {})

    setTimeout(() => fitView({ duration: 300, padding: 0.2 }), 50)
  }, [config, inferredEdges, settings, setNodes, setEdges, fitView])

  const isDarkCanvas = settings?.appearance === "dark"

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: isDarkCanvas ? "#000000" : undefined,
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={exportMode ? undefined : onNodeDragStop}
        nodesDraggable={exportMode ? false : undefined}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        defaultEdgeOptions={{}}
        proOptions={{ hideAttribution: true }}
        onInit={(instance) => instance.fitView()}
      >
        <FocusHandler focusNodeId={focusNodeId} />
        <MiniMap pannable zoomable />

        {/* Dynamic canvas pattern background */}
        {settings && settings.backgroundStyle !== "blank" && (
          <Background
            variant={BG_VARIANT_MAP[settings.backgroundStyle]}
            color={isDarkCanvas ? "#222222" : "#e2e8f0"}
            size={settings.backgroundStyle === "dots" ? 2 : undefined}
            gap={settings.backgroundStyle === "dots" ? 16 : undefined}
            style={{
              opacity: settings.backgroundStyle === "dots" ? 0.7 : 0.4,
            }}
          />
        )}

        {/* Floating controls toolbar */}
        <Toolbar
          settings={settings}
          onSettingsChange={exportMode ? undefined : onSettingsChange}
          onAutoArrange={exportMode ? undefined : handleAutoArrange}
          projectName={projectName}
        />

        {/* Brand identity badge */}
        <LogoBadge dark={isDarkCanvas} exportMode={exportMode} />

        {/* Static export banner if applicable */}
        {exportMode && <ExportBanner dark={isDarkCanvas} />}
      </ReactFlow>
    </div>
  )
}
