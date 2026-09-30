import type { ColorScheme } from "../types"

/**
 * Props for ColorSchemeToggle.
 */
interface ColorSchemeToggleProps {
  /** Active color scheme ('light' or 'dark') */
  scheme: ColorScheme
  /** Callback triggered when the scheme is toggled */
  onChange: (scheme: ColorScheme) => void
  /** Text/icon color matching parent pill contrast */
  textColor: string
  /** Whether parent pill has an active accent color applied */
  hasAccent: boolean
  /** Test identifier attribute for testing libraries */
  testId?: string
}

/**
 * ColorSchemeToggle provides an ultra-compact light/dark mode switch.
 *
 * Designed with high readability and tactile feedback:
 * - Subtle sun (☀) and moon (☾) indicators.
 * - Smooth animated slider pill.
 * - Accessible native checkbox under the hood.
 */
export function ColorSchemeToggle({
  scheme,
  onChange,
  textColor,
  hasAccent,
  testId,
}: ColorSchemeToggleProps) {
  const isDark = scheme === "dark"

  const handleToggle = () => {
    onChange(isDark ? "light" : "dark")
  }

  // Adaptive background and track colors based on accent status
  const trackBg = isDark
    ? hasAccent
      ? "rgba(255, 255, 255, 0.4)"
      : "#64748b"
    : hasAccent
      ? "rgba(255, 255, 255, 0.25)"
      : "#cbd5e1"

  return (
    <div
      data-testid={testId}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        userSelect: "none",
      }}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Sun indicator */}
      <span
        style={{
          fontSize: 10,
          lineHeight: 1,
          color: textColor,
          opacity: isDark ? 0.4 : 1,
          transition: "opacity 0.15s ease",
        }}
        aria-hidden="true"
      >
        ☀
      </span>

      {/* Switch Track */}
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
          onChange={handleToggle}
          aria-label="Toggle dark color scheme"
          style={{
            position: "absolute",
            opacity: 0,
            width: 0,
            height: 0,
            margin: 0,
          }}
        />
        {/* Track pill */}
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 9999,
            background: trackBg,
            transition: "background 0.15s ease",
          }}
        />
        {/* Sliding thumb */}
        <span
          style={{
            position: "absolute",
            top: 2,
            left: isDark ? 14 : 2,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#ffffff",
            boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
            transition: "left 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </label>

      {/* Moon indicator */}
      <span
        style={{
          fontSize: 10,
          lineHeight: 1,
          color: textColor,
          opacity: isDark ? 1 : 0.4,
          transition: "opacity 0.15s ease",
        }}
        aria-hidden="true"
      >
        ☾
      </span>
    </div>
  )
}
