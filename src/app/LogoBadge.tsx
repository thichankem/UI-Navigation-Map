import { useState } from "react"
import { AboutModal } from "./AboutModal"
import { Toast, type ToastData } from "./Toast"
import { GitHubIcon, DownloadIcon } from "./icons"

/**
 * Props for the LogoBadge component.
 */
interface LogoBadgeProps {
  /** Whether the canvas is rendered in dark mode */
  dark?: boolean
  /** Whether running inside static HTML export */
  exportMode?: boolean
}

/** Milliseconds before export status toast automatically dismisses */
const TOAST_DURATION_MS = 5000

/**
 * LogoBadge renders the project brand pill at the top-left of the canvas.
 *
 * Includes:
 * - Brand logo linking to repository
 * - "About" button opening modal with project overview
 * - "Contribute" link to GitHub
 * - One-click static standalone HTML export trigger
 */
export function LogoBadge({ dark, exportMode }: LogoBadgeProps) {
  const [aboutOpen, setAboutOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [toast, setToast] = useState<ToastData | null>(null)

  const showToast = (message: string, type: ToastData["type"]) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), TOAST_DURATION_MS)
  }

  // Calls dev server static export endpoint
  const handleExport = async () => {
    setExporting(true)
    setToast(null)
    try {
      const res = await fetch("/__unm/export", { method: "POST" })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Export failed")
      }
      showToast(`Exported to ${data.path}`, "success")
    } catch (err: any) {
      showToast(err.message || "Export failed", "error")
    } finally {
      setExporting(false)
    }
  }

  const pillBg = dark ? "#1e1e1e" : "#ffffff"
  const pillBorder = `1px solid ${dark ? "#333333" : "#e2e8f0"}`
  const pillColor = dark ? "#e2e8f0" : "#334155"
  const dividerColor = dark ? "#444444" : "#e2e8f0"

  const actionButtonStyle = (busy: boolean): React.CSSProperties => ({
    background: "transparent",
    border: "none",
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "2px 8px",
    borderRadius: 9999,
    fontSize: 12,
    fontWeight: 500,
    color: pillColor,
    cursor: busy ? "wait" : "pointer",
    opacity: busy ? 0.5 : 1,
    transition: "opacity 0.15s ease",
  })

  return (
    <>
      <div
        data-testid="logo-badge"
        role="navigation"
        aria-label="Application brand and links"
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          background: pillBg,
          border: pillBorder,
          borderRadius: 9999,
          padding: "6px 6px 6px 14px",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: pillColor,
          userSelect: "none",
          boxShadow: dark
            ? "0 4px 16px rgba(0, 0, 0, 0.4)"
            : "0 4px 16px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Brand link */}
        <a
          href="https://github.com/thichankem/UI-Navigation-Map"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: "none",
            color: "inherit",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ opacity: 0.55, marginRight: 1 }}>ui-navigation</span>
          <span>map</span>
        </a>

        <div
          style={{
            width: 1,
            height: 16,
            background: dividerColor,
            margin: "0 8px",
          }}
        />

        {/* About Modal Button */}
        <button
          type="button"
          data-testid="about-button"
          onClick={() => setAboutOpen(true)}
          style={{
            background: "transparent",
            border: "none",
            display: "flex",
            alignItems: "center",
            padding: "2px 8px",
            borderRadius: 9999,
            fontSize: 12,
            fontWeight: 500,
            color: pillColor,
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          About
        </button>

        <div style={{ width: 1, height: 16, background: dividerColor }} />

        {/* Contribute via GitHub */}
        <a
          href="https://github.com/thichankem/UI-Navigation-Map"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contribute via GitHub"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "2px 8px",
            borderRadius: 9999,
            fontSize: 12,
            fontWeight: 500,
            color: pillColor,
            textDecoration: "none",
          }}
        >
          <GitHubIcon />
          Contribute
        </a>

        {/* HTML Export Button (hidden in static export) */}
        {!exportMode && (
          <>
            <div style={{ width: 1, height: 16, background: dividerColor }} />
            <button
              type="button"
              data-testid="export-html"
              disabled={exporting}
              onClick={handleExport}
              style={actionButtonStyle(exporting)}
              title="Export single-file static HTML bundle"
            >
              <DownloadIcon />
              {exporting ? "Exporting..." : "Export"}
            </button>
          </>
        )}
      </div>

      {aboutOpen && (
        <AboutModal dark={dark} onClose={() => setAboutOpen(false)} />
      )}

      {toast && <Toast toast={toast} dark={dark} />}
    </>
  )
}
