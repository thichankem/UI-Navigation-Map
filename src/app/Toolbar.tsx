import { useState, useEffect, useRef } from "react"
import { useReactFlow } from "@xyflow/react"
import { ACCENT_COLORS } from "../types"
import type { CanvasSettings, BackgroundStyle, LineStyle } from "../types"
import { exportCanvasPng } from "./export-png"

/**
 * Props for the Toolbar component.
 */
interface ToolbarProps {
  /** Active canvas settings (appearance, colors, styles) */
  settings?: CanvasSettings
  /** Callback fired when canvas settings are modified */
  onSettingsChange?: (settings: CanvasSettings) => void
  /** Handler to compute and apply automated DAG layout */
  onAutoArrange?: () => void
  /** Project name used for PNG export file naming */
  projectName?: string
}

/**
 * Common button style definition for floating toolbar buttons.
 */
const btnStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  padding: "2px 6px",
  borderRadius: 9999,
  fontSize: 14,
  lineHeight: 1,
  color: "#334155",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "opacity 0.15s ease, background 0.15s ease",
}

/**
 * Button style for items inside the settings popover dropdown.
 */
const popoverBtnStyle: React.CSSProperties = {
  ...btnStyle,
  fontSize: 11,
  padding: "4px 8px",
}

/**
 * ToggleButton renders an individual segmented option within the settings popover.
 */
function ToggleButton({
  label,
  icon,
  active,
  dark,
  onClick,
}: {
  label: string
  icon?: string
  active: boolean
  dark?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{
        ...popoverBtnStyle,
        background: active ? (dark ? "#333333" : "#e2e8f0") : "transparent",
        fontWeight: active ? 600 : 400,
        color: dark ? "#e2e8f0" : "#334155",
        flex: 1,
        borderRadius: 6,
      }}
    >
      {icon ? `${icon} ${label}` : label}
    </button>
  )
}

/**
 * Toolbar renders a compact floating dock at the top-right corner of the canvas.
 *
 * Provides quick access to:
 * - Zoom in / Zoom out / Fit view
 * - Auto-arrange layout trigger
 * - Full canvas PNG screenshot capture
 * - Settings popover (Light/Dark mode, Accent colors, Background pattern, Line style)
 */
export function Toolbar({
  settings,
  onSettingsChange,
  onAutoArrange,
  projectName,
}: ToolbarProps) {
  const { zoomIn, zoomOut, fitView, getNodes } = useReactFlow()
  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Listen for Escape and outside click to close popover
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("mousedown", handleMouseDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleMouseDown)
    }
  }, [open])

  // Helper to partially update canvas settings
  const updateSettings = (patch: Partial<CanvasSettings>) => {
    if (settings && onSettingsChange) {
      onSettingsChange({ ...settings, ...patch })
    }
  }

  const isDark = settings?.appearance === "dark"
  const toolbarBg = isDark ? "#1e1e1e" : "#ffffff"
  const toolbarBorder = isDark ? "#333333" : "#e2e8f0"
  const buttonColor = isDark ? "#e2e8f0" : "#334155"

  return (
    <div
      data-testid="toolbar"
      role="toolbar"
      aria-label="Canvas navigation and controls"
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        zIndex: 10,
        display: "flex",
        gap: 6,
        alignItems: "center",
        background: toolbarBg,
        border: `1px solid ${toolbarBorder}`,
        borderRadius: 9999,
        padding: "6px 10px",
        fontSize: 13,
        boxShadow: isDark
          ? "0 4px 16px rgba(0, 0, 0, 0.4)"
          : "0 4px 16px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Zoom in */}
      <button
        type="button"
        aria-label="Zoom in"
        onClick={() => zoomIn()}
        title="Zoom in"
        style={{ ...btnStyle, color: buttonColor }}
      >
        +
      </button>

      {/* Zoom out */}
      <button
        type="button"
        aria-label="Zoom out"
        onClick={() => zoomOut()}
        title="Zoom out"
        style={{ ...btnStyle, color: buttonColor }}
      >
        −
      </button>

      {/* Fit to view */}
      <button
        type="button"
        aria-label="Fit view"
        onClick={() => fitView()}
        title="Fit all screens in view"
        style={{ ...btnStyle, color: buttonColor }}
      >
        ⊞
      </button>

      {/* Auto arrange (optional) */}
      {onAutoArrange && (
        <button
          type="button"
          data-testid="auto-arrange"
          aria-label="Auto arrange"
          title="Auto arrange screens"
          onClick={onAutoArrange}
          style={{ ...btnStyle, color: buttonColor }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
        </button>
      )}

      {/* Export canvas as PNG */}
      <button
        type="button"
        data-testid="export-canvas-png"
        aria-label="Export canvas as PNG"
        onClick={() =>
          exportCanvasPng(getNodes, {
            backgroundColor: isDark ? "#000000" : "#ffffff",
            projectName,
          })
        }
        title="Export canvas as PNG"
        style={{ ...btnStyle, color: buttonColor }}
      >
        📷
      </button>

      {/* Settings popover toggle */}
      {onSettingsChange && settings && (
        <>
          <div
            style={{
              width: 1,
              height: 16,
              background: isDark ? "#444444" : "#e2e8f0",
            }}
          />
          <div ref={popoverRef} style={{ position: "relative" }}>
            <button
              type="button"
              aria-label="Settings"
              onClick={() => setOpen((prev) => !prev)}
              title="Canvas settings"
              style={{
                ...btnStyle,
                fontSize: 16,
                color: buttonColor,
              }}
            >
              ⚙
            </button>

            {open && (
              <div
                data-testid="settings-popover"
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  background: isDark ? "#1e1e1e" : "#ffffff",
                  border: `1px solid ${isDark ? "#333333" : "#e2e8f0"}`,
                  borderRadius: 10,
                  padding: 12,
                  width: 220,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  boxShadow: isDark
                    ? "0 8px 24px rgba(0,0,0,0.5)"
                    : "0 8px 24px rgba(0,0,0,0.12)",
                  fontSize: 12,
                  color: isDark ? "#e2e8f0" : undefined,
                }}
              >
                {/* Appearance: Light / Dark */}
                <div style={{ display: "flex", gap: 4 }}>
                  <ToggleButton
                    label="Light"
                    icon="☀"
                    active={settings.appearance === "light"}
                    dark={isDark}
                    onClick={() => updateSettings({ appearance: "light" })}
                  />
                  <ToggleButton
                    label="Dark"
                    icon="☾"
                    active={settings.appearance === "dark"}
                    dark={isDark}
                    onClick={() => updateSettings({ appearance: "dark" })}
                  />
                </div>

                {/* Accent palette swatches */}
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {ACCENT_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      data-testid={`accent-${color}`}
                      onClick={() => updateSettings({ accentColor: color })}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: color,
                        border:
                          settings.accentColor === color
                            ? `2px solid ${isDark ? "#e2e8f0" : "#1e293b"}`
                            : "2px solid transparent",
                        cursor: "pointer",
                        padding: 0,
                        transition: "transform 0.1s ease",
                      }}
                      title={color}
                    />
                  ))}
                </div>

                {/* Background style */}
                <div style={{ display: "flex", gap: 4 }}>
                  {(["grid", "dots", "blank"] as BackgroundStyle[]).map(
                    (bg) => (
                      <ToggleButton
                        key={bg}
                        label={bg.charAt(0).toUpperCase() + bg.slice(1)}
                        active={settings.backgroundStyle === bg}
                        dark={isDark}
                        onClick={() => updateSettings({ backgroundStyle: bg })}
                      />
                    ),
                  )}
                </div>

                {/* Flow Line style */}
                <div style={{ display: "flex", gap: 4 }}>
                  {(["solid", "dashed", "dotted"] as LineStyle[]).map(
                    (ls) => (
                      <ToggleButton
                        key={ls}
                        label={ls.charAt(0).toUpperCase() + ls.slice(1)}
                        active={settings.lineStyle === ls}
                        dark={isDark}
                        onClick={() => updateSettings({ lineStyle: ls })}
                      />
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
