import { StudioShell } from "../StudioShell"

const panel = {
  background: "var(--unm-surface)",
  border: "1px solid var(--unm-border)",
  borderRadius: "var(--unm-radius-lg)",
  padding: "var(--unm-spacing-sm)",
}
const label = { fontSize: "0.5546875rem", fontWeight: 700, color: "var(--unm-text-muted)", letterSpacing: 0.5, marginBottom: 6 }
const row = { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.57421875rem", color: "var(--unm-text)", padding: "4px 0", borderBottom: "1px solid var(--unm-border)" }
const bar = { height: 5, borderRadius: 3, background: "var(--unm-surface-alt)", overflow: "hidden", marginTop: 3 }
const fill = { height: "100%", background: "var(--unm-primary)" }

export default function Step03Photo() {
  return (
    <StudioShell step="03">
      <div style={{ display: "flex", gap: "var(--unm-spacing-sm)", height: "100%" }}>
        {/* Canvas */}
        <div style={{ ...panel, flex: 1.4, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
            {["9:16", "16:9", "1:1", "4:5"].map((a, i) => (
              <span key={a} style={{ fontSize: "0.54296875rem", padding: "2px 8px", borderRadius: "var(--unm-radius-full)", background: i === 0 ? "var(--unm-primary)" : "var(--unm-surface-alt)", color: i === 0 ? "#000" : "var(--unm-text-muted)", border: "1px solid var(--unm-border)" }}>{a}</span>
            ))}
          </div>
          <div style={{ width: "62%", aspectRatio: "9/16", background: "linear-gradient(160deg, #1e293b 0%, #0f172a 100%)", borderRadius: "var(--unm-radius-md)", border: "1px solid var(--unm-border)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: "6%", border: "1px dashed rgba(255,255,255,0.25)", borderRadius: 6 }} />
            <div style={{ position: "absolute", left: "12%", top: "10%", fontSize: "0.859375rem", fontWeight: 800, color: "#fff" }}>TITLE SAFE 90%</div>
            <div style={{ position: "absolute", left: "12%", top: "42%", fontSize: "0.7578125rem", fontWeight: 700, color: "var(--unm-primary)" }}>Text Title Hook</div>
            <div style={{ position: "absolute", right: "14%", bottom: "18%", fontSize: "0.9140625rem" }}>➜</div>
          </div>
          <div style={{ fontSize: "0.5234375rem", color: "var(--unm-text-muted)", marginTop: 6 }}>360 × 640 px · Title Safe · Action Safe</div>
        </div>

        {/* Layer compositor + lightroom */}
        <div style={{ ...panel, flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={label}>LỚP ĐỒ HỌA & MẶT NẠ (LAYER COMPOSITOR)</div>
          {[
            { n: "Text Title Hook", m: "normal", o: "100%" },
            { n: "Glow Arrow Sticker", m: "screen", o: "90%" },
            { n: "Cyber Vignette FX", m: "multiply", o: "70%" },
            { n: "Base Frame Canvas", m: "normal", o: "100%" },
          ].map((l) => (
            <div key={l.n} style={row}>
              <span>👁 {l.n}</span>
              <span style={{ color: "var(--unm-text-muted)", fontSize: "0.51953125rem" }}>{l.m} · {l.o}</span>
            </div>
          ))}

          <div style={{ ...label, marginTop: 10 }}>LIGHTROOM ENGINE</div>
          {[
            { n: "Brightness", v: 60 },
            { n: "Contrast", v: 75 },
            { n: "Saturation", v: 70 },
            { n: "Vignette", v: 30 },
          ].map((s) => (
            <div key={s.n} style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.5078125rem", color: "var(--unm-text-muted)" }}><span>{s.n}</span><span>{s.v}%</span></div>
              <div style={bar}><div style={{ ...fill, width: `${s.v}%` }} /></div>
            </div>
          ))}
          <div style={{ marginTop: 8, fontSize: "0.58984375rem", color: "var(--unm-primary)", background: "var(--unm-surface-alt)", border: "1px solid var(--unm-border)", borderRadius: "var(--unm-radius-md)", padding: "6px 8px", textAlign: "center" }} data-unm-navigate="proeditor">Mở Pro Editor →</div>
        </div>
      </div>
    </StudioShell>
  )
}