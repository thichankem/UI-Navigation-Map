import { useEffect, useState, useRef, type ComponentType } from "react"
import type { Viewport, ColorScheme } from "../types"
import { getScreenResolution } from "../types"
import { exportScreenPng } from "./export-png"
import { updateScreenViewport, updateScreenColor } from "./dev-server-api"
import { ViewportSelector } from "./ViewportSelector"
import { ColorPicker } from "./ColorPicker"
import { ColorSchemeToggle } from "./ColorSchemeToggle"
import { CloseIcon } from "./icons"

/**
 * Props for the Viewer modal component.
 */
interface ViewerProps {
  /** Identifier of the currently focused screen */
  screenId: string
  /** Human-readable title of the screen */
  screenTitle: string
  /** The React component implementing the screen */
  component: ComponentType
  /** Callback fired to close the viewer overlay */
  onClose: () => void
  /** Callback fired when a `data-unm-navigate` trigger is clicked */
  onNavigate?: (screenId: string) => void
  /** Global canvas accent color */
  accentColor?: string
  /** Screen-specific accent color override */
  color?: string
  /** Screen-specific device viewport override */
  viewport?: Viewport
  /** Project name for export files */
  projectName?: string
  /** Whether the viewer is running in static export mode */
  exportMode?: boolean
}

/**
 * Viewer renders a full-screen, live interactive presentation mode.
 *
 * Key features:
 * - Real React runtime: useState, forms, modals, dropdowns work natively.
 * - Device viewport simulation (Desktop 1440x900, Tablet 768x1024, Mobile 390x844).
 * - Automatic flow navigation: clicking any element with `data-unm-navigate="target"`
 *   seamlessly transitions to the target screen.
 * - Keyboard navigation: Press `Escape` to return to the infinite canvas.
 */
export function Viewer({
  screenId,
  screenTitle,
  component: ScreenComponent,
  onClose,
  onNavigate,
  accentColor,
  color,
  viewport,
  projectName,
  exportMode,
}: ViewerProps) {
  const [activeViewport, setActiveViewport] = useState<Viewport>(
    viewport ?? "desktop",
  )
  const [activeColorScheme, setActiveColorScheme] =
    useState<ColorScheme>("light")
  const [activeColor, setActiveColor] = useState<string | undefined>(color)
  const contentRef = useRef<HTMLDivElement>(null)

  // Listen for Escape key to close viewer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  // Intercept clicks on [data-unm-navigate] elements for interactive screen-to-screen routing
  useEffect(() => {
    if (!onNavigate || !contentRef.current) return
    const container = contentRef.current

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-unm-navigate]",
      )
      if (target && target.dataset.unmNavigate) {
        e.preventDefault()
        onNavigate(target.dataset.unmNavigate)
      }
    }

    container.addEventListener("click", handleClick)
    return () => container.removeEventListener("click", handleClick)
  }, [onNavigate])

  // Handle device viewport changes
  const handleViewportChange = (vp: Viewport) => {
    setActiveViewport(vp)
    updateScreenViewport(screenId, vp)
  }

  // Handle color customization
  const handleColorChange = (c: string) => {
    setActiveColor(c)
    updateScreenColor(screenId, c)
  }

  const pillBg = activeColor ?? accentColor
  const hasPillColor = Boolean(pillBg)
  const pillTextColor = hasPillColor ? "#ffffff" : "#334155"
  const dividerColor = hasPillColor ? "rgba(255, 255, 255, 0.3)" : "#e2e8f0"
  const isDark = activeColorScheme === "dark"
  const { width: vpWidth, height: vpHeight } =
    getScreenResolution(activeViewport)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${screenTitle} preview`}
      data-testid="viewer-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* Floating Top Controls Pill */}
      <header
        data-testid="viewer-pill"
        style={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 60,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 10px 6px 12px",
          background: hasPillColor ? pillBg : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
          border: hasPillColor ? "none" : "1px solid #e2e8f0",
          borderRadius: 9999,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Screen title */}
        <h2
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: 600,
            color: hasPillColor ? "#ffffff" : "#0f172a",
            whiteSpace: "nowrap",
            letterSpacing: "-0.01em",
          }}
        >
          {screenTitle}
        </h2>

        {/* Color picker & Viewport switcher (hidden in export mode) */}
        {!exportMode && (
          <>
            <ColorPicker
              value={activeColor}
              swatchColor={pillBg ?? "#e2e8f0"}
              onSelect={handleColorChange}
              testIdPrefix="viewer-color-picker"
            />

            <div style={{ width: 1, height: 16, background: dividerColor }} />

            <ViewportSelector
              value={activeViewport}
              onChange={handleViewportChange}
              iconColor={pillTextColor}
              testId="viewer-viewport-select"
            />

            <div style={{ width: 1, height: 16, background: dividerColor }} />
          </>
        )}

        {/* Light/Dark mode toggle */}
        <ColorSchemeToggle
          scheme={activeColorScheme}
          onChange={setActiveColorScheme}
          textColor={pillTextColor}
          hasAccent={hasPillColor}
          testId="viewer-color-scheme-toggle"
        />

        <div style={{ width: 1, height: 16, background: dividerColor }} />

        {/* Export screen as PNG */}
        <button
          type="button"
          data-testid="viewer-export-png"
          aria-label="Export screen as PNG"
          onClick={() => exportScreenPng(screenId, projectName)}
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
          }}
        >
          📷
        </button>

        <div style={{ width: 1, height: 16, background: dividerColor }} />

        {/* Close viewer button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          title="Close viewer (Esc)"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            alignItems: "center",
            color: hasPillColor ? "rgba(255,255,255,0.8)" : "#64748b",
            transition: "opacity 0.15s ease",
          }}
        >
          <CloseIcon />
        </button>
      </header>

      {/* Screen Presentation Container */}
      <main
        style={{
          position: "absolute",
          inset: 0,
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: activeViewport === "desktop" ? "stretch" : "flex-start",
          paddingTop: activeViewport === "desktop" ? 0 : 56,
          background: isDark ? "#0f172a" : "#ffffff",
        }}
      >
        <div
          data-unm-screen-id={screenId}
          style={{
            width: activeViewport === "desktop" ? "100%" : `${vpWidth}px`,
            minHeight: activeViewport === "desktop" ? "100%" : `${vpHeight}px`,
            maxWidth: activeViewport === "desktop" ? undefined : `${vpWidth}px`,
            background: isDark ? "#0f172a" : "#ffffff",
          }}
          data-unm-color-scheme={activeColorScheme}
          className={isDark ? "dark" : ""}
        >
          <div
            ref={contentRef}
            data-unm-screen-content
            style={{ colorScheme: activeColorScheme }}
          >
            <ScreenComponent key={screenId} />
          </div>
        </div>
      </main>
    </div>
  )
}
