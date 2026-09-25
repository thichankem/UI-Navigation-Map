import { useEffect, useState, useRef, type ComponentType } from "react"
import type { Viewport, ColorScheme } from "../types"
import { getScreenResolution } from "../types"
import { exportScreenPng } from "./export-png"
import { updateScreenViewport, updateScreenColor } from "./dev-server-api"
import { ViewportSelector } from "./ViewportSelector"
import { ColorPicker } from "./ColorPicker"
import { ColorSchemeToggle } from "./ColorSchemeToggle"

interface ViewerProps {
  screenId: string
  screenTitle: string
  component: ComponentType
  onClose: () => void
  onNavigate?: (screenId: string) => void
  accentColor?: string
  color?: string
  viewport?: Viewport
  projectName?: string
  exportMode?: boolean
}

export function Viewer({ screenId, screenTitle, component: ScreenComponent, onClose, onNavigate, accentColor, color, viewport, projectName, exportMode }: ViewerProps) {
  const [activeViewport, setActiveViewport] = useState<Viewport>(viewport ?? "desktop")
  const [activeColorScheme, setActiveColorScheme] = useState<ColorScheme>("light")
  const [activeColor, setActiveColor] = useState<string | undefined>(color)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  useEffect(() => {
    if (!onNavigate || !contentRef.current) return
    const el = contentRef.current
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-unm-navigate]")
      if (target) {
        e.preventDefault()
        onNavigate(target.dataset.unmNavigate!)
      }
    }
    el.addEventListener("click", handleClick)
    return () => el.removeEventListener("click", handleClick)
  }, [onNavigate])

  const handleViewportChange = (vp: Viewport) => {
    setActiveViewport(vp)
    updateScreenViewport(screenId, vp)
  }

  const handleColorChange = (c: string) => {
    setActiveColor(c)
    updateScreenColor(screenId, c)
  }

  const pillBg = activeColor ?? accentColor
  const hasPillColor = !!pillBg
  const pillTextColor = hasPillColor ? "#fff" : "#334155"
  const dividerColor = hasPillColor ? "rgba(255,255,255,0.3)" : "#e2e8f0"
  const isDark = activeColorScheme === "dark"
  const { width: vpWidth, height: vpHeight } = getScreenResolution(activeViewport)

  return (
    <div
      data-testid="viewer-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* Floating pill header */}
      <div
        data-testid="viewer-pill"
        style={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 60,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 10px 6px 12px",
          background: hasPillColor ? pillBg! : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
          border: hasPillColor ? "none" : "1px solid #e2e8f0",
          borderRadius: 9999,
        }}
      >
        {/* Title */}
        <h2 style={{ margin: 0, fontSize: "12px", fontWeight: 600, color: hasPillColor ? "#fff" : "#0f172a", whiteSpace: "nowrap" }}>
          {screenTitle}
        </h2>

        {/* Color picker + Viewport — hidden in export mode */}
        {!exportMode && (
          <>
            <ColorPicker
              value={activeColor}
              swatchColor={pillBg ?? "#e2e8f0"}
              onSelect={handleColorChange}
              testIdPrefix="viewer-color-picker"
            />

            <div style={{ width: 1, height: 16, background: dividerColor }} />

            {/* Viewport selector */}
            <ViewportSelector
              value={activeViewport}
              onChange={handleViewportChange}
              iconColor={pillTextColor}
              testId="viewer-viewport-select"
            />

            <div style={{ width: 1, height: 16, background: dividerColor }} />
          </>
        )}

        {/* Dark mode toggle */}
        <ColorSchemeToggle
          scheme={activeColorScheme}
          onChange={setActiveColorScheme}
          textColor={pillTextColor}
          hasAccent={hasPillColor}
          testId="viewer-color-scheme-toggle"
        />

        <div style={{ width: 1, height: 16, background: dividerColor }} />

        {/* Save/export button */}
        <button
          data-testid="viewer-export-png"
          aria-label="Export screen as PNG"
          onClick={() => exportScreenPng(screenId, projectName)}
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

        <div style={{ width: 1, height: 16, background: dividerColor }} />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            color: hasPillColor ? "rgba(255,255,255,0.8)" : "#64748b",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Screen content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: activeViewport === "desktop" ? "stretch" : "flex-start",
          paddingTop: activeViewport === "desktop" ? 0 : 56,
          background: isDark ? "#0f172a" : "white",
        }}
      >
        <div
          data-unm-screen-id={screenId}
          style={{
            width: activeViewport === "desktop" ? "100%" : `${vpWidth}px`,
            minHeight: activeViewport === "desktop" ? "100%" : `${vpHeight}px`,
            maxWidth: activeViewport === "desktop" ? undefined : `${vpWidth}px`,
            background: isDark ? "#0f172a" : "white",
          }}
          data-unm-color-scheme={activeColorScheme}
          className={isDark ? "dark" : ""}
        >
          <div ref={contentRef} data-unm-screen-content style={{ colorScheme: activeColorScheme }}>
            <ScreenComponent key={screenId} />
          </div>
        </div>
      </div>
    </div>
  )
}