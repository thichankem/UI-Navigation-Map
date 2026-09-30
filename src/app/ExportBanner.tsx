/**
 * Props for ExportBanner.
 */
interface ExportBannerProps {
  /** Whether the exported view is rendered in dark mode */
  dark?: boolean
}

/**
 * ExportBanner renders a clean, subtle status indicator at the bottom
 * of the canvas when running in standalone static HTML export mode.
 */
export function ExportBanner({ dark }: ExportBannerProps) {
  return (
    <aside
      data-testid="export-banner"
      aria-label="Static export indicator"
      style={{
        position: "absolute",
        bottom: 12,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        padding: "6px 14px",
        background: dark ? "#1e1e1e" : "#ffffff",
        border: `1px solid ${dark ? "#333333" : "#e2e8f0"}`,
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.01em",
        color: dark ? "#e2e8f0" : "#334155",
        boxShadow: dark
          ? "0 2px 8px rgba(0, 0, 0, 0.5)"
          : "0 2px 8px rgba(0, 0, 0, 0.06)",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      Static export &middot; Read-only
    </aside>
  )
}
