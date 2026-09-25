import { useState, useEffect, useCallback } from "react"
import { Handle, Position, useReactFlow } from "@xyflow/react"
import type { NodeProps, Node } from "@xyflow/react"
import type { ComponentType } from "react"
import type { Viewport, ColorScheme } from "../types"
import { getScreenResolution } from "../types"
import { exportScreenPng } from "./export-png"
import { updateScreenViewport, updateScreenColor } from "./dev-server-api"
import { ViewportSelector } from "./ViewportSelector"
import { ColorPicker } from "./ColorPicker"
import { ColorSchemeToggle } from "./ColorSchemeToggle"

export type ScreenNodeData = {
  title: string
  screenId: string
  onSelect: (screenId: string) => void
  component?: ComponentType
  viewport?: Viewport
  colorScheme?: ColorScheme
  accentColor?: string
  color?: string
  projectName?: string
  exportMode?: boolean
}

export type ScreenNodeType = Node<ScreenNodeData, "screen">

const MAX_THUMBNAIL_DIM = 420

export function ScreenNode({ data, id, selected }: NodeProps<ScreenNodeType>) {
  const ScreenComponent = data.component
  const [activeViewport, setActiveViewport] = useState<Viewport>(data.viewport ?? "desktop")
  const [activeColor, setActiveColor] = useState<string | undefined>(data.color)
  const [activeColorScheme, setActiveColorScheme] = useState<ColorScheme>(data.colorScheme ?? "light")
  const [focusedOnce, setFocusedOnce] = useState(false)
  const { fitView } = useReactFlow()

  const handleViewportChange = (viewport: Viewport) => {
    setActiveViewport(viewport)
    updateScreenViewport(data.screenId, viewport)
  }

  const handleColorChange = (color: string) => {
    setActiveColor(color)
    updateScreenColor(data.screenId, color)
  }

  useEffect(() => {
    if (data.color !== undefined) setActiveColor(data.color)
  }, [data.color])

  useEffect(() => {
    if (data.colorScheme) setActiveColorScheme(data.colorScheme)
  }, [data.colorScheme])

  const pillColor = activeColor ?? data.accentColor
  const { width: fullWidth, height: fullHeight } = getScreenResolution(activeViewport)
  const scale = MAX_THUMBNAIL_DIM / Math.max(fullWidth, fullHeight)
  const thumbnailWidth = Math.round(fullWidth * scale)
  const thumbnailHeight = Math.round(fullHeight * scale)
  const isDark = activeColorScheme === "dark"
  const hasAccent = !!pillColor
  const pillTextColor = hasAccent ? "#fff" : "#334155"
  const dividerColor = hasAccent ? "rgba(255,255,255,0.3)" : "#e2e8f0"

  // Reset focusedOnce when node loses selection
  useEffect(() => {
    if (!selected) setFocusedOnce(false)
  }, [selected])

  const handleNodeClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (focusedOnce) {
      data.onSelect(data.screenId)
    } else {
      setFocusedOnce(true)
      fitView({ nodes: [{ id }], duration: 300, padding: 0.5 })
    }
  }, [focusedOnce, data, id, fitView])

  return (
    <div
      data-unm-screen-id={data.screenId}
      style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* Pill bar with title and controls */}
      <div
        data-testid="node-controls"
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 10px",
          marginBottom: "6px",
          background: hasAccent ? pillColor! : "#fff",
          border: hasAccent ? "none" : "1px solid #e2e8f0",
          borderRadius: 9999,
        }}
      >
        <span
          data-testid="node-title"
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: hasAccent ? "#fff" : "#0f172a",
            whiteSpace: "nowrap",
            marginRight: "2px",
          }}
        >
          {data.title}
        </span>

        {/* Color picker — hidden in export mode */}
        {!data.exportMode && (
          <>
            <ColorPicker
              value={activeColor}
              swatchColor={pillColor ?? "#e2e8f0"}
              onSelect={handleColorChange}
              testIdPrefix="color-picker"
              stopPropagation
            />

            <div style={{ width: 1, height: 16, background: dividerColor }} />

            {/* Viewport dropdown */}
            <ViewportSelector
              value={activeViewport}
              onChange={handleViewportChange}
              iconColor={pillTextColor}
              testId="viewport-select"
            />

            <div style={{ width: 1, height: 16, background: dividerColor }} />
          </>
        )}

        {/* Color scheme toggle */}
        <ColorSchemeToggle
          scheme={activeColorScheme}
          onChange={setActiveColorScheme}
          textColor={pillTextColor}
          hasAccent={hasAccent}
          testId="color-scheme-toggle"
        />

        <div style={{ width: 1, height: 16, background: dividerColor }} />

        {/* Export screen as PNG */}
        <button
          data-testid="export-screen-png"
          aria-label="Export screen as PNG"
          onClick={(e) => {
            e.stopPropagation()
            exportScreenPng(data.screenId, data.projectName)
          }}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: "2px 4px",
            fontSize: 12,
            lineHeight: 1,
            color: pillTextColor,
          }}
        >
          📷
        </button>
      </div>

      {/* Preview rectangle */}
      <div
        data-testid="screen-thumbnail"
        onClick={handleNodeClick}
        style={{
          width: `${thumbnailWidth}px`,
          height: `${thumbnailHeight}px`,
          background: isDark ? "#0f172a" : "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 0,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Handle type="target" position={Position.Left} id="target-left" />
        <Handle type="target" position={Position.Top} id="target-top" />
        <Handle type="source" position={Position.Right} id="source-right" />
        <Handle type="source" position={Position.Bottom} id="source-bottom" />
        <Handle type="source" position={Position.Left} id="source-left" />
        <Handle type="target" position={Position.Right} id="target-right" />
        <Handle type="target" position={Position.Bottom} id="target-bottom" />
        <Handle type="source" position={Position.Top} id="source-top" />
        {ScreenComponent ? (
          <div
            style={{ colorScheme: activeColorScheme }}
            className={isDark ? "dark" : ""}
            data-unm-color-scheme={activeColorScheme}
          >
            <div
              data-unm-screen-content
              style={{
                width: `${fullWidth}px`,
                height: `${fullHeight}px`,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                pointerEvents: "none",
              }}
            >
              <ScreenComponent />
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#94a3b8",
              fontSize: "12px",
            }}
          >
            No preview
          </div>
        )}
      </div>

    </div>
  )
}