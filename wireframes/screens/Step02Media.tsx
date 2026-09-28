import { StudioShell } from "../StudioShell"

const panel = {
  background: "var(--unm-surface)",
  border: "1px solid var(--unm-border)",
  borderRadius: "var(--unm-radius-lg)",
  padding: "var(--unm-spacing-sm)",
}
const label = { fontSize: "0.56640625rem", fontWeight: 700, color: "var(--unm-text-muted)", letterSpacing: 0.5, marginBottom: 6 }
const chip = { background: "var(--unm-surface-alt)", border: "1px solid var(--unm-border)", borderRadius: "var(--unm-radius-full)", padding: "2px 8px", fontSize: "0.52734375rem", color: "var(--unm-text-muted)", display: "inline-block", marginRight: 4, marginBottom: 4 }
const tab = { fontSize: "0.59765625rem", color: "var(--unm-text)", background: "var(--unm-surface-alt)", border: "1px solid var(--unm-border)", borderRadius: "var(--unm-radius-md)", padding: "5px 10px", display: "inline-block", marginRight: 6 }

export default function Step02Media() {
  const modes = ["Kho Tư Liệu (Media Bin)", "Slide HTML/CSS", "Khai Thác Video URL"]
  return (
    <StudioShell step="A">
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--unm-spacing-sm)", height: "100%" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {modes.map((m, i) => (
            <span key={m} style={{ ...tab, ...(i === 0 ? { border: "1px solid var(--unm-primary)", color: "var(--unm-primary)", fontWeight: 700 } : {}) }}>{m}</span>
          ))}
        </div>

        <div style={{ ...panel, flex: 1, overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={label}>KHO TƯ LIỆU — 0 TỆP KHẢ DỤNG</div>
            <div style={{ ...chip, color: "var(--unm-primary)" }}>🧹 Quét Trùng Lặp (dHash)</div>
          </div>
          <div style={{ background: "var(--unm-surface-alt)", border: "1px dashed var(--unm-border)", borderRadius: "var(--unm-radius-md)", padding: "var(--unm-spacing-md)", textAlign: "center", color: "var(--unm-text-muted)", fontSize: "0.6171875rem" }}>
            Kéo thả hoặc tải tệp lên — video · hình ảnh · âm thanh · tài liệu · slide HTML
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 8 }}>
            {["plane-crash-show.mp4", "thumb_3054.jpg", "vo_over.wav", "slide_intro.html"].map((f) => (
              <div key={f} style={{ background: "var(--unm-surface-alt)", border: "1px solid var(--unm-border)", borderRadius: "var(--unm-radius-md)", padding: 10, textAlign: "center", fontSize: "0.53515625rem", color: "var(--unm-text-muted)" }}>
                <div style={{ fontSize: "1.09375rem" }}>🎬</div>
                {f}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "var(--unm-spacing-sm)" }}>
          <div style={{ ...panel, flex: 1 }}>
            <div style={label}>HTML SLIDE DECK</div>
            <div style={{ fontSize: "0.55859375rem", color: "var(--unm-text-muted)" }}>5 template: Cyberpunk · Stat Counter · Before/After · Glassmorphic · Terminal</div>
          </div>
          <div style={{ ...panel, flex: 1 }}>
            <div style={label}>VIDEO URL RECOOK</div>
            <div style={{ fontSize: "0.55859375rem", color: "var(--unm-text-muted)" }}>Tải URL → transcript → tái cấu trúc script → sản xuất video mới</div>
          </div>
        </div>
      </div>
    </StudioShell>
  )
}