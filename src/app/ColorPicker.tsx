import { useEffect, useRef, useState } from "react"
import { ACCENT_COLORS } from "../types"

interface ColorPickerProps {
  value: string | undefined
  swatchColor: string
  onSelect: (color: string) => void
  testIdPrefix: string
  stopPropagation?: boolean
}

export function ColorPicker({ value, swatchColor, onSelect, testIdPrefix, stopPropagation }: ColorPickerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as HTMLElement)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  const stop = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation()
  }

  return (
    <div ref={ref} style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <button
        data-testid={`${testIdPrefix}-button`}
        aria-label="Pick screen color"
        onClick={(e) => {
          stop(e)
          setOpen(!open)
        }}
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.6)",
          background: swatchColor,
          cursor: "pointer",
          padding: 0,
        }}
      />
      {open && (
        <div
          data-testid={`${testIdPrefix}-popover`}
          style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginTop: 6,
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: 6,
            display: "flex",
            gap: 4,
            zIndex: 10,
          }}
        >
          {ACCENT_COLORS.map((c) => (
            <button
              key={c}
              onClick={(e) => {
                stop(e)
                setOpen(false)
                onSelect(c)
              }}
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: c,
                border: c === value ? "2px solid #0f172a" : "2px solid transparent",
                cursor: "pointer",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}