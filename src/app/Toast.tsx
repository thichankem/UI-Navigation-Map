/**
 * Notification toast payload data structure.
 */
export interface ToastData {
  /** Text message to display */
  message: string
  /** Notification severity / type */
  type: "success" | "error"
}

/**
 * Props for Toast component.
 */
interface ToastProps {
  /** Toast message and state */
  toast: ToastData
  /** Whether canvas is currently in dark mode */
  dark?: boolean
}

/**
 * Toast renders a minimal, non-intrusive floating feedback notification.
 *
 * Appears below the top navigation controls when operations like HTML export
 * complete or encounter errors.
 */
export function Toast({ toast, dark }: ToastProps) {
  const isError = toast.type === "error"

  const borderColor = isError
    ? "#ef4444"
    : dark
      ? "#333333"
      : "#e2e8f0"

  const textColor = isError
    ? "#ef4444"
    : dark
      ? "#e2e8f0"
      : "#334155"

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="export-toast"
      style={{
        position: "absolute",
        top: 52,
        left: 12,
        zIndex: 10,
        padding: "8px 14px",
        background: dark ? "#1e1e1e" : "#ffffff",
        border: `1px solid ${borderColor}`,
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 500,
        color: textColor,
        boxShadow: dark
          ? "0 4px 12px rgba(0, 0, 0, 0.4)"
          : "0 4px 12px rgba(0, 0, 0, 0.1)",
        maxWidth: 400,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        gap: 6,
        pointerEvents: "none",
        animation: "fade-in 0.2s ease-out",
      }}
    >
      <span style={{ fontWeight: 700 }} aria-hidden="true">
        {isError ? "✗ " : "✓ "}
      </span>
      <span>{toast.message}</span>
    </div>
  )
}
