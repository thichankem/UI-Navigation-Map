import { useEffect } from "react"

/**
 * Props for AboutModal.
 */
interface AboutModalProps {
  /** Whether the modal should render in dark mode */
  dark?: boolean
  /** Callback fired when user dismisses the modal */
  onClose: () => void
}

/**
 * AboutModal displays project mission, architecture philosophy,
 * interaction shortcuts, and open-source licensing.
 */
export function AboutModal({ dark, onClose }: AboutModalProps) {
  // Listen for Escape key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const bg = dark ? "#1e1e1e" : "#ffffff"
  const border = `1px solid ${dark ? "#333333" : "#e2e8f0"}`
  const textColor = dark ? "#e2e8f0" : "#1e293b"

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-dialog-title"
      data-testid="about-modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        data-testid="about-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: bg,
          border,
          borderRadius: 16,
          padding: "32px 36px",
          maxWidth: 480,
          width: "90%",
          color: textColor,
          boxShadow: dark
            ? "0 24px 48px rgba(0, 0, 0, 0.6)"
            : "0 24px 48px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Header / Brand Title */}
        <div
          id="about-dialog-title"
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span style={{ opacity: 0.55 }}>ui-navigation</span>
          <span>map</span>
        </div>

        {/* Primary Mission Description */}
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            margin: "0 0 18px",
            opacity: 0.9,
          }}
        >
          An infinite wireframe canvas where every screen is a real, live React
          component. Map intuitive user journeys and export cleanly into production.
        </p>

        {/* Motivation / Concept */}
        <div
          style={{
            fontSize: 13,
            lineHeight: 1.7,
            opacity: 0.75,
            marginBottom: 24,
          }}
        >
          <p style={{ margin: "0 0 8px", fontWeight: 600, opacity: 1 }}>
            Design Without Disconnect
          </p>
          <p style={{ margin: "0 0 10px" }}>
            AI tools generate React screens in seconds, but visualizing multi-step
            navigation and testing real component interactions usually requires static
            mockups that drift from code.
          </p>
          <p style={{ margin: 0 }}>
            UI Navigation Map keeps code as the single source of truth: double-click to
            interact with modals and dropdowns, drag nodes to persist layout, and
            export single-file presentations anytime.
          </p>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${dark ? "#333333" : "#e2e8f0"}`,
            paddingTop: 16,
            fontSize: 12,
            opacity: 0.55,
          }}
        >
          <span>MIT License &middot; September 2026</span>
          <span>UI Navigation Map</span>
        </div>
      </div>
    </div>
  )
}
