import { useEffect, useRef, useState } from "react"
import { ACCENT_COLORS } from "../types"

/**
 * Props for ColorPicker component.
 */
interface ColorPickerProps {
  /** Currently selected color hex value */
  value: string | undefined
  /** Swatch preview color displayed on the trigger circle */
  swatchColor: string
  /** Callback fired when a color swatch is clicked */
  onSelect: (color: string) => void
  /** Prefix for test IDs (e.g. 'color-picker' or 'viewer-color-picker') */
  testIdPrefix: string
  /** Whether to stop event propagation (e.g., prevent React Flow node drag) */
  stopPropagation?: boolean
}

/**
 * ColorPicker presents a sleek circular trigger and an inline palette popup.
 *
 * Allows developers and designers to quickly tint individual screens
 * or flow categories directly on the wireframe canvas.
 */
export function ColorPicker({
  value,
  swatchColor,
  onSelect,
  testIdPrefix,
  stopPropagation,
}: ColorPickerProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-close popover when clicking outside
  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  // Helper to optionally stop event bubbling
  const handleEventStop = (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.stopPropagation()
    }
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {/* Trigger swatch button */}
      <button
        type="button"
        data-testid={`${testIdPrefix}-button`}
        aria-label="Pick screen color"
        onClick={(e) => {
          handleEventStop(e)
          setOpen((prev) => !prev)
        }}
        title="Change screen accent color"
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          border: "2px solid rgba(255, 255, 255, 0.6)",
          background: swatchColor,
          cursor: "pointer",
          padding: 0,
          boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
          transition: "transform 0.15s ease",
        }}
      />

      {/* Palette Popover */}
      {open && (
        <div
          data-testid={`${testIdPrefix}-popover`}
          style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginTop: 6,
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: 6,
            display: "flex",
            gap: 4,
            zIndex: 10,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
          }}
        >
          {ACCENT_COLORS.map((colorHex) => {
            const isSelected = colorHex === value
            return (
              <button
                key={colorHex}
                type="button"
                onClick={(e) => {
                  handleEventStop(e)
                  setOpen(false)
                  onSelect(colorHex)
                }}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: colorHex,
                  border: isSelected
                    ? "2px solid #0f172a"
                    : "2px solid transparent",
                  cursor: "pointer",
                  padding: 0,
                  transition: "transform 0.1s ease",
                }}
                title={colorHex}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
