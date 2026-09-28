import { StudioShell } from "../StudioShell"

const panel = {
  background: "var(--unm-surface)",
  border: "1px solid var(--unm-border)",
  borderRadius: "var(--unm-radius-lg)",
  padding: "var(--unm-spacing-sm)",
}
const label = { fontSize: "0.522460938rem", fontWeight: 700, color: "var(--unm-text-muted)", letterSpacing: 0.5, marginBottom: 6 }

export default function CampaignEmpire() {
  return (
    <StudioShell step="01">
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--unm-spacing-sm)", height: "100%" }}>
        {/* Master topic + ratio */}
        <div style={{ ...panel }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "0.611328125rem", fontWeight: 800, color: "var(--unm-secondary)" }}>CONTENT EMPIRE HUB — 1 TOPIC ➔ 1 YOUTUBE + 5 TIKTOK</div>
            <div style={{ fontSize: "0.497070313rem", color: "var(--unm-text-muted)" }}>Shorts: 5 · YouTube: 10m</div>
          </div>
          <div style={{ display: "flex", gap: 2, marginTop: 8 }}>
            {[
              ["30%", "var(--unm-primary)", "AI Video"],
              ["20%", "var(--unm-info)", "Ảnh thật"],
              ["15%", "var(--unm-warning)", "Bản đồ 3D"],
              ["15%", "var(--unm-success)", "Báo & Hồ sơ"],
              ["10%", "var(--unm-secondary)", "Sơ đồ"],
              ["10%", "var(--unm-text-muted)", "Motion"],
            ].map(([w, c, l]) => (
              <div key={l} style={{ width: w, height: 10, background: c, borderRadius: 3, marginRight: 2 }} title={l} />
            ))}
          </div>
          <div style={{ fontSize: "0.466796875rem", color: "var(--unm-text-muted)", marginTop: 4 }}>Golden Hybrid Media Ratio — loại bỏ cảm giác "AI rẻ tiền"</div>
        </div>

        <div style={{ display: "flex", gap: "var(--unm-spacing-sm)", flex: 1 }}>
          {/* YouTube long */}
          <div style={{ ...panel, flex: 1.2 }}>
            <div style={label}>YOUTUBE LONG-FORM MASTERPIECE (8-BƯỚC ARC)</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
              {["Hook", "Setup", "Rising", "Climax", "Turn", "Fall", "Legacy", "CTA"].map((s, i) => (
                <span key={s} style={{ fontSize: "0.458984375rem", padding: "3px 6px", borderRadius: "var(--unm-radius-md)", background: i <= 3 ? "var(--unm-primary)" : "var(--unm-surface-alt)", color: i <= 3 ? "#000" : "var(--unm-text-muted)", border: "1px solid var(--unm-border)" }}>{s}</span>
              ))}
            </div>
            <div style={{ background: "var(--unm-surface-alt)", border: "1px solid var(--unm-border)", borderRadius: "var(--unm-radius-md)", padding: 8, fontSize: "0.532226563rem", color: "var(--unm-text-muted)", minHeight: 60 }}>
              Narration script (10 phút) — kể chuyện điện ảnh, dẫn chứng, hồi hộp...
            </div>
            <div style={{ marginTop: 6, fontSize: "0.502929688rem", color: "var(--unm-text)" }}>🎯 5 tiêu đề CTR cao: "1. Bí mật ít ai biết về..."</div>
          </div>

          {/* TikTok shorts */}
          <div style={{ ...panel, flex: 1 }}>
            <div style={label}>TIKTOK / SHORTS VIRAL SERIES (#1-#5)</div>
            <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
              {["#1", "#2", "#3", "#4", "#5"].map((s, i) => (
                <span key={s} style={{ fontSize: "0.462890625rem", padding: "3px 8px", borderRadius: "var(--unm-radius-full)", background: i === 0 ? "var(--unm-secondary)" : "var(--unm-surface-alt)", color: i === 0 ? "#000" : "var(--unm-text-muted)", border: "1px solid var(--unm-border)" }}>{s}</span>
              ))}
            </div>
            <div style={{ fontSize: "0.547851563rem", color: "var(--unm-text)", fontWeight: 700 }}>SHORT #1 — Góc: "Sai lầm chết người"</div>
            <div style={{ fontSize: "0.530273438rem", color: "var(--unm-warning)", margin: "4px 0" }}>HOOK: "Bạn đang vo gạo sai cách!"</div>
            <div style={{ background: "var(--unm-surface-alt)", border: "1px solid var(--unm-border)", borderRadius: "var(--unm-radius-md)", padding: 8, fontSize: "0.514648438rem", color: "var(--unm-text-muted)", minHeight: 50 }}>Script 60s...</div>
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              <span style={{ fontSize: "0.473632813rem", color: "var(--unm-primary)", border: "1px solid var(--unm-primary)", borderRadius: "var(--unm-radius-md)", padding: "3px 8px" }}>📋 Copy Kling 9:16</span>
              <span style={{ fontSize: "0.469726563rem", color: "var(--unm-secondary)", border: "1px solid var(--unm-secondary)", borderRadius: "var(--unm-radius-md)", padding: "3px 8px" }}>🖼 Copy Midjourney</span>
            </div>
          </div>
        </div>

        <div style={{ ...panel }}>
          <div style={label}>15-ASSET PROMPT MATRIX</div>
          <div style={{ display: "flex", gap: 6 }}>
            {["🎬 Kling/Veo", "🖼 Midjourney", "🎵 Suno", "🎙 ElevenLabs", "🔍 Fact-Check"].map((t) => (
              <span key={t} style={{ fontSize: "0.485351563rem", padding: "4px 10px", borderRadius: "var(--unm-radius-md)", background: "var(--unm-surface-alt)", border: "1px solid var(--unm-border)", color: "var(--unm-text-muted)" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </StudioShell>
  )
}