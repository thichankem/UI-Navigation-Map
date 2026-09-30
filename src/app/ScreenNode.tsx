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

/**
 * Data payload provided to each ScreenNode instance.
 */
export type ScreenNodeData = {
  /** Human-readable title of the screen */
  title: string
  /** Normalized lowercase filename / identifier */
  screenId: string
  /** Callback to open this screen in the full interactive viewer */
  onSelect: (screenId: string) => void
  /** React component rendering the screen */
  component?: ComponentType
  /** Preferred device viewport ('desktop' | 'tablet' | 'mobile') */
  viewport?: Viewport
  /** Color scheme override ('light' | 'dark') */
  colorScheme?: ColorScheme
  /** Global canvas accent color */
  accentColor?: string
  /** Screen-specific accent color */
  color?: string
  /** Project name for export prefixes */
  projectName?: string
  /** Flag indicating static HTML export mode */
  exportMode?: boolean
}

/**
 * React Flow node definition type for screen nodes.
 */
export type ScreenNodeType = Node<ScreenNodeData, "screen">

/** Maximum thumbnail dimension in pixels on the canvas */
const MAX_THUMBNAIL_DIM = 420

/**
 * ScreenNode renders a live, interactive wireframe card on the canvas.
 *
 * Structure:
 * 1. Top floating pill bar containing:
 *    - Screen title
 *    - Custom color picker (hidden in export mode)
 *    - Device viewport switcher (hidden in export mode)
 *    - Per-screen light/dark scheme toggle
 *    - Individual high-res PNG snapshot button
 * 2. High-fidelity thumbnail card:
 *    - Scaled live React component
 *    - 8 connection handles on all 4 borders for bidirectional arrows
 *    - Double-click / focus interaction pattern
 */
export function ScreenNode({ data, id, selected }: NodeProps<ScreenNodeType>) {
  const ScreenComponent = data.component
  const [activeViewport, setActiveViewport] = useState<Viewport>(
    data.viewport ?? "desktop",
  )
  const [activeColor, setActiveColor] = useState<string | undefined>(data.color)
  const [activeColorScheme, setActiveColorScheme] = useState<ColorScheme>(
    data.colorScheme ?? "light",
  )
  const [focusedOnce, setFocusedOnce] = useState(false)
  const { fitView } = useReactFlow()

  // Handle viewport changes and notify dev server
  const handleViewportChange = (viewport: Viewport) => {
    setActiveViewport(viewport)
    updateScreenViewport(data.screenId, viewport)
  }

  // Handle color customization and notify dev server
  const handleColorChange = (color: string) => {
    setActiveColor(color)
    updateScreenColor(data.screenId, color)
  }

  // Synchronize when external props update
  useEffect(() => {
    if (data.color !== undefined) {
      setActiveColor(data.color)
    }
  }, [data.color])

  useEffect(() => {
    if (data.colorScheme) {
      setActiveColorScheme(data.colorScheme)
    }
  }, [data.colorScheme])

  // Reset focus state if selection changes
  useEffect(() => {
    if (!selected) {
      setFocusedOnce(false)
    }
  }, [selected])

  // Derive thumbnail geometry from device resolutions
  const pillColor = activeColor ?? data.accentColor
  const { width: fullWidth, height: fullHeight } =
    getScreenResolution(activeViewport)
  const scale = MAX_THUMBNAIL_DIM / Math.max(fullWidth, fullHeight)
  const thumbnailWidth = Math.round(fullWidth * scale)
  const thumbnailHeight = Math.round(fullHeight * scale)
  const isDark = activeColorScheme === "dark"
  const hasAccent = Boolean(pillColor)

  const pillTextColor = hasAccent ? "#ffffff" : "#334155"
  const dividerColor = hasAccent ? "rgba(255, 255, 255, 0.3)" : "#e2e8f0"

  // First click centers/focuses node; second click enters full-screen viewer
  const handleNodeClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (focusedOnce) {
        data.onSelect(data.screenId)
      } else {
        setFocusedOnce(true)
        fitView({ nodes: [{ id }], duration: 300, padding: 0.5 })
      }
    },
    [focusedOnce, data, id, fitView],
  )

  return (
    <div
      data-unm-screen-id={data.screenId}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Top Controls Pill Bar */}
      <div
        data-testid="node-controls"
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 10px",
          marginBottom: 6,
          background: hasAccent ? pillColor : "#ffffff",
          border: hasAccent ? "none" : "1px solid #e2e8f0",
          borderRadius: 9999,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          transition: "background 0.15s ease, border-color 0.15s ease",
        }}
      >
        {/* Title */}
        <span
          data-testid="node-title"
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: hasAccent ? "#ffffff" : "#0f172a",
            whiteSpace: "nowrap",
            marginRight: 2,
            letterSpacing: "-0.01em",
          }}
        >
          {data.title}
        </span>

        {/* Color picker & Viewport switcher (hidden in export mode) */}
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

        {/* Export individual screen as PNG */}
        <button
          type="button"
          data-testid="export-screen-png"
          aria-label="Export screen as PNG"
          onClick={(e) => {
            e.stopPropagation()
            exportScreenPng(data.screenId, data.projectName)
          }}
          title="Export screen as PNG"
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: "2px 4px",
            fontSize: 12,
            lineHeight: 1,
            color: pillTextColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          📷
        </button>
      </div>

      {/* Screen Thumbnail Viewport */}
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
          boxShadow: isDark
            ? "0 4px 16px rgba(0, 0, 0, 0.45)"
            : "0 4px 16px rgba(0, 0, 0, 0.08)",
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
        }}
      >
        {/* Connection Handles (all 4 sides, source and target) */}
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
              fontSize: 12,
              letterSpacing: "0.02em",
            }}
          >
            No preview
          </div>
        )}
      </div>
    </div>
  )
}
