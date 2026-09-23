import { ReactFlow, MiniMap, Background, BackgroundVariant, useNodesState, useEdgesState, useReactFlow } from "@xyflow/react"
import type { Node, Edge } from "@xyflow/react"
import { useCallback, useEffect, type ComponentType } from "react"
import { ScreenNode } from "./ScreenNode"
import { FlowEdge } from "./FlowEdge"
import { Toolbar } from "./Toolbar"
import { LogoBadge } from "./LogoBadge"
import { ExportBanner } from "./ExportBanner"
import type { DesignFlowConfig, EdgeConfig, CanvasSettings } from "../types"

const nodeTypes = { screen: ScreenNode }
const edgeTypes = { flow: FlowEdge }

interface CanvasProps {
  config: DesignFlowConfig
  screens?: Record<string, ComponentType>
  onScreenSelect: (screenId: string) => void
  focusNodeId?: string | null
  inferredEdges?: EdgeConfig[]
  settings?: CanvasSettings
  onSettingsChange?: (settings: CanvasSettings) => void
  projectName?: string
  exportMode?: boolean
}

function configToNodes(
  config: DesignFlowConfig,
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

function pairKey(a: string, b: string): string {
  return a < b ? `${a}:${b}` : `${b}:${a}`
}

function pickHandles(
  positions: Record<string, { x: number; y: number }>,
  fromId: string,
  toId: string,
): { sourceHandle: string; targetHandle: string } {
  const fromPos = positions[fromId]
  const toPos = positions[toId]
  if (!fromPos || !toPos) return { sourceHandle: "source-right", targetHandle: "target-left" }

  const dx = toPos.x - fromPos.x
  const dy = toPos.y - fromPos.y

  if (Math.abs(dx) >= Math.abs(dy)) {
    // Horizontal dominant
    if (dx >= 0) return { sourceHandle: "source-right", targetHandle: "target-left" }
    return { sourceHandle: "source-left", targetHandle: "target-right" }
  }
  // Vertical dominant
  if (dy >= 0) return { sourceHandle: "source-bottom", targetHandle: "target-top" }
  return { sourceHandle: "source-top", targetHandle: "target-bottom" }
}

function getPositions(
  config: DesignFlowConfig,
  nodeOverrides?: Record<string, { x: number; y: number }>,
): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {}
  for (const [id, screen] of Object.entries(config.screens)) {
    positions[id] = nodeOverrides?.[id] ?? screen.position
  }
  return positions
}

function configToEdges(
  config: DesignFlowConfig,
  inferredEdges?: EdgeConfig[],
  settings?: CanvasSettings,
  nodePositions?: Record<string, { x: number; y: number }>,
): Edge[] {
  const positions = nodePositions ?? getPositions(config)
  const seenPairs = new Set<string>()

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
        data: { label: edge.label, accentColor: settings?.accentColor, lineStyle: settings?.lineStyle },
      }
    })

  if (!inferredEdges?.length) return explicitEdges

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
        data: { label: edge.label, inferred: true, accentColor: settings?.accentColor, lineStyle: settings?.lineStyle },
      }
    })

  return [...explicitEdges, ...inferred]
}

function FocusHandler({ focusNodeId }: { focusNodeId?: string | null }) {
  const { fitView } = useReactFlow()

  useEffect(() => {
    if (focusNodeId) {
      setTimeout(() => {
        fitView({ nodes: [{ id: focusNodeId }], duration: 300, padding: 0.5 })
      }, 50)
    }
  }, [focusNodeId, fitView])

  return null
}

const bgVariantMap = {
  grid: BackgroundVariant.Lines,
  dots: BackgroundVariant.Dots,
}

export function Canvas({ config, screens, onScreenSelect, focusNodeId, inferredEdges, settings, onSettingsChange, projectName, exportMode }: CanvasProps) {
  const initialNodes = configToNodes(config, onScreenSelect, screens, settings?.accentColor, settings?.appearance, projectName, exportMode)
  const initialEdges = configToEdges(config, inferredEdges, settings)

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => {
    setEdges(configToEdges(config, inferredEdges, settings))
    setNodes((prev) => prev.map((node) => ({
      ...node,
      data: {
        ...node.data,
        accentColor: settings?.accentColor,
        colorScheme: settings?.appearance,
        projectName,
        exportMode,
      },
    })))
  }, [settings?.accentColor, settings?.lineStyle, settings?.appearance])

  const onNodeDragStop = useCallback((_event: React.MouseEvent, node: Node) => {
    fetch("/__designflow/update-positions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        positions: { [node.id]: { x: node.position.x, y: node.position.y } },
      }),
    })
    // Recalculate edges with updated node positions
    setNodes((currentNodes) => {
      const livePositions: Record<string, { x: number; y: number }> = {}
      for (const n of currentNodes) {
        livePositions[n.id] = n.position
      }
      setEdges(configToEdges(config, inferredEdges, settings, livePositions))
      return currentNodes
    })
  }, [config, inferredEdges, settings, setEdges, setNodes])

  const isDarkCanvas = settings?.appearance === "dark"

  return (
    <div style={{ width: "100%", height: "100vh", background: isDarkCanvas ? "#000000" : undefined }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={exportMode ? undefined : onNodeDragStop}
        nodesDraggable={exportMode ? false : undefined}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{}}
        proOptions={{ hideAttribution: true }}
        onInit={(instance) => instance.fitView()}
      >
        <FocusHandler focusNodeId={focusNodeId} />
        <MiniMap pannable zoomable />
        {settings && settings.backgroundStyle !== "blank" && (
          <Background
            variant={bgVariantMap[settings.backgroundStyle]}
            color={isDarkCanvas ? "#222" : "#e2e8f0"}
            size={settings.backgroundStyle === "dots" ? 2 : undefined}
            gap={settings.backgroundStyle === "dots" ? 16 : undefined}
            style={{ opacity: settings.backgroundStyle === "dots" ? 0.7 : 0.4 }}
          />
        )}
        <Toolbar settings={settings} onSettingsChange={exportMode ? undefined : onSettingsChange} projectName={projectName} />
        <LogoBadge dark={isDarkCanvas} exportMode={exportMode} />
        {exportMode && <ExportBanner dark={isDarkCanvas} />}
      </ReactFlow>
    </div>
  )
}