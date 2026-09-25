import { useState } from "react"
import { AboutModal } from "./AboutModal"
import { Toast, type ToastData } from "./Toast"

interface LogoBadgeProps {
  dark?: boolean
  exportMode?: boolean
}

const TOAST_DURATION_MS = 5000

export function LogoBadge({ dark, exportMode }: LogoBadgeProps) {
  const [aboutOpen, setAboutOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [toast, setToast] = useState<ToastData | null>(null)

  const showToast = (message: string, type: ToastData["type"]) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), TOAST_DURATION_MS)
  }

  const handleExport = async () => {
    setExporting(true)
    setToast(null)
    try {
      const res = await fetch("/__unm/export", { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Export failed")
      showToast(`Exported to ${data.path}`, "success")
    } catch (err: any) {
      showToast(err.message || "Export failed", "error")
    } finally {
      setExporting(false)
    }
  }

  const pillBg = dark ? "#1e1e1e" : "#fff"
  const pillBorder = `1px solid ${dark ? "#333" : "#e2e8f0"}`
  const pillColor = dark ? "#e2e8f0" : "#334155"
  const dividerColor = dark ? "#444" : "#e2e8f0"

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
  })

  return (
    <>
      <div
        data-testid="logo-badge"
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
        }}
      >
        <a
          href="https://github.com/thichankem/UI-Navigation-Map"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center" }}
        >
          <span style={{ opacity: 0.5, marginRight: 1 }}>ui-navigation</span>
          <span>map</span>
        </a>
        <div style={{ width: 1, height: 16, background: dividerColor, margin: "0 8px" }} />
        <button
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Contribute
        </a>
        {!exportMode && (
          <>
            <div style={{ width: 1, height: 16, background: dividerColor }} />
            <button
              data-testid="export-html"
              disabled={exporting}
              onClick={handleExport}
              style={actionButtonStyle(exporting)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {exporting ? "Exporting..." : "Export"}
            </button>
          </>
        )}
      </div>

      {aboutOpen && <AboutModal dark={dark} onClose={() => setAboutOpen(false)} />}

      {toast && <Toast toast={toast} dark={dark} />}
    </>
  )
}