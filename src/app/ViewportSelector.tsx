import type { Viewport } from "../types"
import { viewportIcons } from "./icons"

interface ViewportSelectorProps {
  value: Viewport
  onChange: (viewport: Viewport) => void
  iconColor: string
  testId: string
}

export function ViewportSelector({ value, onChange, iconColor, testId }: ViewportSelectorProps) {
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <span style={{ color: iconColor, display: "flex", pointerEvents: "none" }}>
        {viewportIcons[value]()}
      </span>
      <select
        data-testid={testId}
        value={value}
        onChange={(e) => onChange(e.target.value as Viewport)}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          cursor: "pointer",
          border: "none",
          fontSize: 10,
        }}
      >
        <option value="desktop">Desktop</option>
        <option value="tablet">Tablet</option>
        <option value="mobile">Mobile</option>
      </select>
    </div>
  )
}