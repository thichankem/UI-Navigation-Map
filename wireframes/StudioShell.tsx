import type { ReactNode } from "react"

const stepBtn = {
  background: "var(--unm-surface)",
  border: "1px solid var(--unm-border)",
  borderRadius: "var(--unm-radius-md)",
  padding: "6px 8px",
  fontSize: "0.65625rem",
  color: "var(--unm-text-muted)",
  cursor: "pointer",
  textAlign: "left" as const,
}

export function StudioShell({ step, children }: { step: string; children: ReactNode }) {
  // The studio's real sidebar: the 5 project functions plus the one advanced
  // entry that is left. "04 Video FX" and "07 Export" are gone with their
  // screens (frontend.md III.13, III.15), and the timeline screen *is* function
  // 04 — hence its ``step="04"`` below.
  const steps = [
    "01 Kịch bản",
    "02 AI Auto-Edit",
    "03 Photo",
    "04 Video (NLE)",
    "05 Audio",
    "A Tư liệu dự án",
  ]

  return (
    <div
      style={{
        background: "var(--unm-background)",
        minHeight: "100vh",
        fontFamily: "var(--unm-font-family)",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* Topbar */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: "var(--unm-spacing-sm)",
          padding: "8px var(--unm-spacing-md)",
          borderBottom: "1px solid var(--unm-border)",
          background: "var(--unm-background)",
        }}
      >
        <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg, var(--unm-primary), var(--unm-secondary))", display: "grid", placeItems: "center", fontWeight: 900, color: "#000", fontSize: "0.59375rem" }}>CF</div>
        <div style={{ fontSize: "0.625rem", color: "var(--unm-text-muted)", fontWeight: 700 }}>DỰ ÁN: TAM Flight 3054</div>
        <div style={{ fontSize: "0.53125rem", color: "var(--unm-success)", background: "var(--unm-surface)", border: "1px solid var(--unm-border)", borderRadius: "var(--unm-radius-full)", padding: "1px 6px" }}>● Đã lưu</div>
        <div style={{ flex: 1 }} />
        <div style={{ width: 24, height: 24, borderRadius: "var(--unm-radius-full)", background: "linear-gradient(135deg, var(--unm-primary), var(--unm-secondary))", display: "grid", placeItems: "center", color: "#000", fontSize: "0.59375rem" }}>O</div>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Sidebar */}
        <div
          style={{
            width: 150, borderRight: "1px solid var(--unm-border)",
            padding: "var(--unm-spacing-sm)", display: "flex", flexDirection: "column", gap: 4, flexShrink: 0,
          }}
        >
          <div style={{ fontSize: "0.546875rem", fontWeight: 800, letterSpacing: 1, color: "var(--unm-text-muted)", marginBottom: 2 }}>5 CHỨC NĂNG + MỤC A</div>
          {steps.map((s) => {
            const active = s.startsWith(step)
            return (
              <div
                key={s}
                style={{
                  ...stepBtn,
                  ...(active
                    ? { background: "var(--unm-surface-alt)", border: "1px solid var(--unm-primary)", color: "var(--unm-text)", fontWeight: 700 }
                    : {}),
                }}
              >
                {s}
              </div>
            )
          })}
          <div style={{ flex: 1 }} />
          <div style={{ ...stepBtn, color: "var(--unm-secondary)" }}>✨ Omni Campaign</div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, minWidth: 0, padding: "var(--unm-spacing-sm)", overflow: "hidden" }}>{children}</div>
      </div>
    </div>
  )
}