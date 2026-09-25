export function ExportBanner({ dark }: { dark?: boolean }) {
  return (
    <div
      data-testid="export-banner"
      style={{
        position: "absolute",
        bottom: 12,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        padding: "6px 14px",
        background: dark ? "#1e1e1e" : "#fff",
        border: `1px solid ${dark ? "#333" : "#e2e8f0"}`,
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 500,
        color: dark ? "#e2e8f0" : "#334155",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      Static export &middot; Read-only
    </div>
  )
}