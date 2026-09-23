import { useEffect } from "react"

interface AboutModalProps {
  dark?: boolean
  onClose: () => void
}

export function AboutModal({ dark, onClose }: AboutModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [onClose])

  return (
    <div
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
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        data-testid="about-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: dark ? "#1e1e1e" : "#fff",
          border: `1px solid ${dark ? "#333" : "#e2e8f0"}`,
          borderRadius: 16,
          padding: "32px 36px",
          maxWidth: 480,
          width: "90%",
          color: dark ? "#e2e8f0" : "#1e293b",
          boxShadow: dark
            ? "0 24px 48px rgba(0, 0, 0, 0.6)"
            : "0 24px 48px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Logo */}
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 20 }}>
          <span style={{ opacity: 0.5 }}>design</span>
          <span>flow</span>
        </div>

        {/* Description */}
        <p style={{ fontSize: 14, lineHeight: 1.7, margin: "0 0 20px", opacity: 0.85 }}>
          An infinite canvas where every screen is a real React component.
          Visualize flows, then eject into production routing code.
        </p>

        {/* Motivation */}
        <div style={{ fontSize: 13, lineHeight: 1.8, opacity: 0.7, marginBottom: 24 }}>
          <p style={{ margin: "0 0 10px", fontWeight: 600, opacity: 1 }}>Why this exists</p>
          <p style={{ margin: "0 0 10px" }}>
            AI lets anyone generate working React screens in seconds.
            Existing solutions still introduce gaps between the human,
            the mockup, and the frontend.
          </p>
          <p style={{ margin: 0 }}>
            DesignFlow is where you lay those screens out, draw the flows
            between them, and export the whole thing as code.
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${dark ? "#333" : "#e2e8f0"}`,
            paddingTop: 16,
            fontSize: 12,
            opacity: 0.5,
          }}
        >
          <span>MIT License</span>
          <span>designflow.cc</span>
        </div>
      </div>
    </div>
  )
}