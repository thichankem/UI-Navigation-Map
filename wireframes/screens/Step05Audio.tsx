import { StudioShell } from "../StudioShell"

const panel = {
  background: "var(--unm-surface)",
  border: "1px solid var(--unm-border)",
  borderRadius: "var(--unm-radius-lg)",
  padding: "var(--unm-spacing-sm)",
}
const label = { fontSize: "0.544921875rem", fontWeight: 700, color: "var(--unm-text-muted)", letterSpacing: 0.5, marginBottom: 6 }
const tab = { fontSize: "0.587890625rem", color: "var(--unm-text-muted)", background: "var(--unm-surface-alt)", border: "1px solid var(--unm-border)", borderRadius: "var(--unm-radius-md)", padding: "5px 10px", display: "inline-block", marginRight: 6 }
const chan = { background: "var(--unm-surface-alt)", border: "1px solid var(--unm-border)", borderRadius: "var(--unm-radius-md)", padding: "var(--unm-spacing-sm)", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }
const fader = { width: 6, height: 64, borderRadius: 3, background: "var(--unm-border)", position: "relative" as const }
const knob = (top: number) => ({ position: "absolute" as const, left: -3, top, width: 12, height: 12, borderRadius: "var(--unm-radius-full)", background: "var(--unm-primary)" })

export default function Step05Audio() {
  return (
    <StudioShell step="05">
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--unm-spacing-sm)", height: "100%" }}>
        <div>
          {["Multi-track Mixer", "5-Band Parametric EQ", "Sidechain Auto-Ducking", "AI Neural Voiceover (TTS)", "Khử Ồn"].map((t, i) => (
            <span key={t} style={{ ...tab, ...(i === 0 ? { border: "1px solid var(--unm-primary)", color: "var(--unm-primary)", fontWeight: 700 } : {}) }}>{t}</span>
          ))}
          <span style={{ float: "right", fontSize: "0.505859375rem", color: "var(--unm-success)", background: "var(--unm-surface)", border: "1px solid var(--unm-border)", borderRadius: "var(--unm-radius-full)", padding: "2px 8px" }}>-14 LUFS BROADCAST READY</span>
        </div>

        {/* Mixer */}
        <div style={{ ...panel, flex: 1 }}>
          <div style={label}>BỘ TRỘN ĐA KÊNH</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--unm-spacing-sm)" }}>
            {[
              { n: "Ch1 · MC", v: 92, c: "var(--unm-primary)" },
              { n: "Ch2 · BGM", v: 38, c: "var(--unm-secondary)" },
              { n: "Ch3 · SFX", v: 65, c: "var(--unm-warning)" },
              { n: "Ch4 · Foley", v: 25, c: "var(--unm-success)" },
            ].map((ch) => (
              <div key={ch.n} style={chan}>
                <div style={{ fontSize: "0.58203125rem", fontWeight: 700, color: "var(--unm-text)" }}>{ch.n}</div>
                <div style={{ fontSize: "0.46875rem", color: "var(--unm-text-muted)" }}>M · S</div>
                <div style={fader}><div style={knob(`${100 - ch.v}px`)} /></div>
                <div style={{ fontSize: "0.484375rem", color: "var(--unm-text-muted)" }}>{ch.v}%</div>
                <div style={{ fontSize: "0.50390625rem", color: ch.c }}>PAN: Center</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "var(--unm-spacing-sm)" }}>
          <div style={{ ...panel, flex: 1 }}>
            <div style={label}>5-BAND PARAMETRIC EQ</div>
            <div style={{ background: "var(--unm-surface-alt)", border: "1px solid var(--unm-border)", borderRadius: "var(--unm-radius-md)", height: 56, position: "relative" }}>
              <svg width="100%" height="56" viewBox="0 0 300 56">
                <path d="M0 40 C 40 10, 90 48, 150 28 S 250 8, 300 30" stroke="var(--unm-primary)" strokeWidth="2" fill="none" />
                {[40, 100, 170, 235, 290].map((x) => <circle key={x} cx={x} cy={30} r="4" fill="var(--unm-secondary)" />)}
              </svg>
            </div>
          </div>
          <div style={{ ...panel, flex: 1 }}>
            <div style={label}>SIDECHAIN AUTO-DUCKING</div>
            <div style={{ fontSize: "0.564453125rem", color: "var(--unm-text-muted)" }}>BGM tự hạ khi giọng đọc · Reduction 12dB · Attack 5ms · Release 250ms</div>
          </div>
        </div>
      </div>
    </StudioShell>
  )
}