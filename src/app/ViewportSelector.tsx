import type { Viewport } from "../types"
import { viewportIcons } from "./icons"

/**
 * Props for ViewportSelector.
 */
interface ViewportSelectorProps {
  /** Currently active device viewport preset */
  value: Viewport
  /** Callback fired when user selects a different viewport */
  onChange: (viewport: Viewport) => void
  /** Foreground color for the device icon */
  iconColor: string
  /** Test identifier attribute for testing libraries */
  testId: string
}

/**
 * ViewportSelector provides a compact, clean device switcher.
 *
 * It displays a crisp SVG icon corresponding to Desktop, Tablet, or Mobile,
 * overlaid with an invisible native `<select>` dropdown for frictionless,
 * fully accessible selection across desktop and touch devices.
 */
export function ViewportSelector({
  value,
  onChange,
  iconColor,
  testId,
}: ViewportSelectorProps) {
  const IconComponent = viewportIcons[value]

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 20,
        height: 20,
      }}
      title={`Current viewport: ${value}`}
    >
      {/* Visual device icon */}
      <span
        style={{
          color: iconColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          transition: "color 0.15s ease",
        }}
        aria-hidden="true"
      >
        {IconComponent && <IconComponent />}
      </span>

      {/* Invisible native select overlaid on top */}
      <select
        data-testid={testId}
        value={value}
        onChange={(e) => onChange(e.target.value as Viewport)}
        aria-label="Select viewport device"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
          cursor: "pointer",
          border: "none",
          fontSize: 10,
        }}
      >
        <option value="desktop">desktop</option>
        <option value="tablet">tablet</option>
        <option value="mobile">mobile</option>
      </select>
    </div>
  )
}
