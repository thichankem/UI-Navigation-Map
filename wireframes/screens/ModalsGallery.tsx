const modal = {
  background: "var(--unm-surface)",
  border: "1px solid var(--unm-border)",
  borderRadius: "var(--unm-radius-lg)",
  padding: "var(--unm-spacing-sm)",
  cursor: "pointer",
}
const title = { fontWeight: 700, fontSize: "0.615234375rem", color: "var(--unm-text)", marginBottom: 4 }
const desc = { fontSize: "0.534179688rem", color: "var(--unm-text-muted)", lineHeight: 1.4 }

const modals = [
  { icon: "🛡️", name: "ComplianceModal", desc: "QA & Bản quyền — chuẩn nền tảng, brand kit, copyright hash", color: "#34d399" },
  { icon: "🖼️", name: "ThumbnailModal", desc: "Auto-Thumbnail & Dự đoán CTR — 3 style, chọn khung hình", color: "#fbbf24" },
  { icon: "💰", name: "AuditCostModal", desc: "Cost Guard — ước lượng chi phí token + audit trail SHA-256", color: "#fb7185" },
  { icon: "📥", name: "ExternalIngestionModal", desc: "Nạp media ngoài — Kling/Veo, ElevenLabs, Perplexity, batch", color: "#38bdf8" },
  { icon: "🎯", name: "SeoPackagingModal", desc: "SEO Packaging & 70-Signal Scoring — tối ưu title/desc/tags", color: "#fbbf24" },
  { icon: "📁", name: "NewProjectModal", desc: "Tạo dự án — chỉ tên dự án + chọn 1 trong 2 loại pipeline", color: "#22d3ee" },
  { icon: "⌨️", name: "ShortcutsModal", desc: "Phím tắt Adobe Creative Suite — NLE mappings", color: "#94a3b8" },
]

export default function ModalsGallery() {
  return (
    <div
      style={{
        background: "var(--unm-background)",
        minHeight: "100vh",
        fontFamily: "var(--unm-font-family)",
        padding: "var(--unm-spacing-lg)",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontWeight: 800, fontSize: "0.9453125rem", color: "var(--unm-text)", marginBottom: 4 }}>
        7 GLOBAL MODALS
      </div>
      <div style={{ fontSize: "0.62890625rem", color: "var(--unm-text-muted)", marginBottom: "var(--unm-spacing-md)" }}>
        Mở bằng deep-link ?modal=&lt;tên&gt; trên studio :3000
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--unm-spacing-sm)" }}>
        {modals.map((m) => (
          <div key={m.name} style={{ ...modal, borderLeft: `3px solid ${m.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "1.0546875rem" }}>{m.icon}</span>
              <span style={title}>{m.name}</span>
            </div>
            <div style={desc}>{m.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "var(--unm-spacing-md)", fontSize: "0.595703125rem", color: "var(--unm-text-muted)" }}>
        ← Quay lại <span style={{ color: "var(--unm-primary)", cursor: "pointer" }} data-unm-navigate="launcher">Project Launcher</span>
      </div>
    </div>
  )
}