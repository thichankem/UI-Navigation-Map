export interface ToastData {
  message: string
  type: "success" | "error"
}

export function Toast({ toast, dark }: { toast: ToastData; dark?: boolean }) {
  return (
    <div
      data-testid="export-toast"
      style={{
        position: "absolute",
        top: 52,
        left: 12,
        zIndex: 10,
        padding: "8px 14px",
        background: dark ? "#1e1e1e" : "#fff",
        border: `1px solid ${toast.type === "error" ? "#ef4444" : dark ? "#333" : "#e2e8f0"}`,
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 500,
        color: toast.type === "error" ? "#ef4444" : dark ? "#e2e8f0" : "#334155",
        boxShadow: dark ? "0 4px 12px rgba(0,0,0,0.4)" : "0 4px 12px rgba(0,0,0,0.1)",
        maxWidth: 400,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {toast.type === "success" ? "✓ " : "✗ "}{toast.message}
    </div>
  )
}