import { StudioShell } from "../StudioShell"

const panel = {
  background: "var(--unm-surface)",
  border: "1px solid var(--unm-border)",
  borderRadius: "var(--unm-radius-lg)",
  padding: "var(--unm-spacing-sm)",
}
const label = { fontSize: "0.5283203125rem", fontWeight: 700, color: "var(--unm-text-muted)", letterSpacing: 0.5, marginBottom: 6 }
const tab = { fontSize: "0.607421875rem", fontWeight: 700, color: "var(--unm-text)", background: "var(--unm-surface-alt)", border: "1px solid var(--unm-border)", borderRadius: "var(--unm-radius-md)", padding: "6px 14px", display: "inline-block", marginRight: 6 }

export default function ProEditor() {
  return (
    <StudioShell step="03">
      {/* Full-screen Adobe-style tab bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--unm-spacing-sm)", marginBottom: "var(--unm-spacing-sm)" }}>
        <div style={{ fontSize: "0.62109375rem", fontWeight: 800, color: "var(--unm-warning)", letterSpacing: 1 }}>PRO EDITOR</div>
        {["Editing", "Graphics", "FX & Color", "Audio"].map((t, i) => (
          <span key={t} style={{ ...tab, ...(i === 1 ? { border: "1px solid var(--unm-primary)", color: "var(--unm-primary)" } : {}) }}>{t}</span>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: "0.498046875rem", color: "var(--unm-text-muted)", border: "1px solid var(--unm-border)", borderRadius: "var(--unm-radius-md)", padding: "4px 8px", cursor: "pointer" }} data-unm-navigate="step03">⛶ Thoát Pro Editor</span>
      </div>

      <div style={{ display: "flex", gap: "var(--unm-spacing-sm)", height: "calc(100% - 40px)" }}>
        {/* Graphics canvas */}
        <div style={{ ...panel, flex: 1.4, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ ...label, alignSelf: "flex-start" }}>GRAPHICS — PHOTO LAB</div>
          <div style={{ width: "58%", aspectRatio: "9/16", background: "linear-gradient(160deg,#1e293b,#0f172a)", borderRadius: "var(--unm-radius-md)", border: "1px solid var(--unm-border)", position: "relative" }}>
            <div style={{ position: "absolute", left: "12%", top: "10%", fontSize: "0.83984375rem", fontWeight: 800, color: "#fff" }}>TITLE SAFE</div>
            <div style={{ position: "absolute", left: "12%", top: "42%", fontSize: "0.73828125rem", fontWeight: 700, color: "var(--unm-primary)" }}>Text Title Hook</div>
            <div style={{ position: "absolute", right: "14%", bottom: "18%", fontSize: "0.89453125rem" }}>➜</div>
          </div>
        </div>

        {/* Right panels */}
        <div style={{ ...panel, flex: 1 }}>
          <div style={label}>LAYER COMPOSITOR</div>
          {["Text Title Hook · normal 100%", "Glow Arrow · screen 90%", "Vignette FX · multiply 70%"].map((l) => (
            <div key={l} style={{ fontSize: "0.551757813rem", color: "var(--unm-text)", padding: "4px 0", borderBottom: "1px solid var(--unm-border)" }}>👁 {l}</div>
          ))}
          <div style={{ ...label, marginTop: 8 }}>LIGHTROOM ENGINE</div>
          <div style={{ fontSize: "0.536132813rem", color: "var(--unm-text-muted)" }}>Brightness +10 · Contrast +25 · Saturation +20 · Vignette 30</div>
          <div style={{ ...label, marginTop: 8 }}>KEYFRAME GRAPH</div>
          <div style={{ background: "var(--unm-surface-alt)", border: "1px solid var(--unm-border)", borderRadius: "var(--unm-radius-md)", height: 48 }}>
            <svg width="100%" height="48" viewBox="0 0 300 48">
              <path d="M0 40 C 60 36, 120 10, 200 14 S 280 8, 300 6" stroke="var(--unm-primary)" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>
      </div>
    </StudioShell>
  )
}