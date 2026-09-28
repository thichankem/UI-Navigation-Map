import { StudioShell } from "../StudioShell"

const panel = {
  background: "var(--unm-surface)",
  border: "1px solid var(--unm-border)",
  borderRadius: "var(--unm-radius-lg)",
  padding: "var(--unm-spacing-sm)",
}
const label = { fontSize: "0.541015625rem", fontWeight: 700, color: "var(--unm-text-muted)", letterSpacing: 0.5, marginBottom: 6 }
const track = { display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid var(--unm-border)", padding: "3px 0" }
const trackLabel = { width: 74, fontSize: "0.509765625rem", color: "var(--unm-text-muted)", flexShrink: 0 }
const clip = (w: string, color: string) => ({ width: w, height: 22, borderRadius: 5, background: color, border: "1px solid var(--unm-border)", flexShrink: 0, fontSize: "0.44921875rem", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(0,0,0,0.75)", fontWeight: 700, overflow: "hidden" })

export default function Step06Timeline() {
  return (
    <StudioShell step="04">
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--unm-spacing-sm)", height: "100%" }}>
        {/* Dual monitors */}
        <div style={{ display: "flex", gap: "var(--unm-spacing-sm)", flex: 1 }}>
          <div style={{ ...panel, flex: 1.4, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={label}>PROGRAM MONITOR</div>
              <div style={{ fontSize: "0.478515625rem", color: "var(--unm-text-muted)", fontFamily: "monospace" }}>00:00:12:08</div>
            </div>
            <div style={{ flex: 1, background: "linear-gradient(160deg,#0f172a,#000)", borderRadius: "var(--unm-radius-md)", border: "1px solid var(--unm-border)", position: "relative" }}>
              <div style={{ position: "absolute", inset: "5%", border: "1px dashed rgba(255,255,255,0.2)", borderRadius: 4 }} />
              <div style={{ position: "absolute", left: "10%", top: "8%", fontSize: "0.671875rem", color: "#fff", fontWeight: 800 }}>TIKTOK SAFE ZONE</div>
              <div style={{ position: "absolute", left: "10%", bottom: "12%", fontSize: "0.6328125rem", color: "var(--unm-primary)", fontWeight: 700 }}>Phụ đề karaoke...</div>
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 6, fontSize: "0.45703125rem", color: "var(--unm-text-muted)", justifyContent: "center" }}>◀ ▶ ⏵ ⏸ ⏹ · SMPTE · VOLUME</div>
          </div>

          <div style={{ ...panel, flex: 1 }}>
            <div style={label}>PROPERTIES INSPECTOR</div>
            {["Typography — Font · Weight · Align", "Appearance — Fill · Stroke · Glow", "Neural Cutout & Mask — Chroma Key", "Captions — 6 Template Categories"].map((p) => (
              <div key={p} style={{ fontSize: "0.556640625rem", color: "var(--unm-text)", padding: "5px 0", borderBottom: "1px solid var(--unm-border)" }}>▸ {p}</div>
            ))}
            <div style={{ ...label, marginTop: 8 }}>CAPTION SIMPLIFIER</div>
            <div style={{ fontSize: "0.537109375rem", color: "var(--unm-text-muted)" }}>vi/en · Trending · Emphasis · Glow · Emoji · Monoline · Multiline</div>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ ...panel, flex: 1 }}>
          <div style={label}>TIMELINE — 5 TRACKS (V1/V2/A1/A2/C1)</div>
          <div style={{ overflow: "hidden" }}>
            <div style={track}><span style={trackLabel}>V1 Video</span><div style={clip("38%", "var(--unm-primary)")}>SCENE 01</div><div style={clip("30%", "var(--unm-info)")}>SCENE 02</div><div style={clip("26%", "var(--unm-primary)")}>SCENE 03</div></div>
            <div style={track}><span style={trackLabel}>V2 B-Roll</span><div style={clip("20%", "var(--unm-secondary)")}>B-ROLL</div></div>
            <div style={track}><span style={trackLabel}>A1 Voice</span><div style={clip("94%", "var(--unm-success)")}>VOICEOVER</div></div>
            <div style={track}><span style={trackLabel}>A2 BGM</span><div style={clip("94%", "var(--unm-warning)")}>MUSIC BED</div></div>
            <div style={track}><span style={trackLabel}>C1 Captions</span><div style={clip("94%", "var(--unm-text-muted)")}>CAPTIONS</div></div>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            {["🧲 Snap", "✂ Split", "⛓ Merge", "⧉ Dup", "🗑 Del", "🧹 Clean", "🩺 Check", "📋 Render Plan"].map((t) => (
              <span key={t} style={{ fontSize: "0.482421875rem", padding: "3px 8px", borderRadius: "var(--unm-radius-md)", background: "var(--unm-surface-alt)", border: "1px solid var(--unm-border)", color: "var(--unm-text-muted)" }}>{t}</span>
            ))}
            <span style={{ marginLeft: "auto", fontSize: "0.494140625rem", color: "var(--unm-warning)", border: "1px solid var(--unm-warning)", borderRadius: "var(--unm-radius-md)", padding: "3px 8px" }} data-unm-navigate="step07">Gate 2: Duyệt Video →</span>
          </div>
        </div>
      </div>
    </StudioShell>
  )
}