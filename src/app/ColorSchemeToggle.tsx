import type { ColorScheme } from "../types"

interface ColorSchemeToggleProps {
  scheme: ColorScheme
  onChange: (scheme: ColorScheme) => void
  textColor: string
  hasAccent: boolean
  testId?: string
}

export function ColorSchemeToggle({ scheme, onChange, textColor, hasAccent, testId }: ColorSchemeToggleProps) {
  const isDark = scheme === "dark"

  return (
    <div data-testid={testId} style={{ display: "flex", alignItems: "center", gap: 3 }}>
      <span style={{ fontSize: 10, color: textColor, opacity: isDark ? 0.4 : 1 }}>☀</span>
      <label
        style={{
          position: "relative",
          display: "inline-block",
          width: 28,
          height: 16,
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={isDark}
          onChange={() => onChange(isDark ? "light" : "dark")}
          style={{
            opacity: 0,
            width: 0,
            height: 0,
            position: "absolute",
          }}
        />
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 9999,
            background: isDark ? (hasAccent ? "rgba(255,255,255,0.4)" : "#64748b") : (hasAccent ? "rgba(255,255,255,0.25)" : "#cbd5e1"),
            transition: "background 0.15s",
          }}
        />
        <span
          style={{
            position: "absolute",
            top: 2,
            left: isDark ? 14 : 2,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.15s",
          }}
        />
      </label>
      <span style={{ fontSize: 10, color: textColor, opacity: isDark ? 1 : 0.4 }}>☾</span>
    </div>
  )
}