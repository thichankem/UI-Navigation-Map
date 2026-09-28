import { StudioShell } from "../StudioShell"

const panel = {
  background: "var(--unm-surface)",
  border: "1px solid var(--unm-border)",
  borderRadius: "var(--unm-radius-lg)",
  padding: "var(--unm-spacing-sm)",
}
const label = { fontSize: "0.578125rem", fontWeight: 700, color: "var(--unm-text-muted)", letterSpacing: 0.5, marginBottom: 6 }
const field = { background: "var(--unm-surface-alt)", border: "1px solid var(--unm-border)", borderRadius: "var(--unm-radius-md)", padding: "6px 8px", fontSize: "0.609375rem", color: "var(--unm-text-muted)", marginBottom: 6 }
const chip = { background: "var(--unm-surface-alt)", border: "1px solid var(--unm-border)", borderRadius: "var(--unm-radius-full)", padding: "2px 8px", fontSize: "0.5390625rem", color: "var(--unm-text-muted)", display: "inline-block", marginRight: 4, marginBottom: 4 }

/**
 * Step 01 — Soạn kịch bản.
 *
 * One surface only: the script editor. The two things that used to sit here are
 * gone from the app: the "0. Skill cho AI" handover panel (with its sub-tab rail)
 * and the "Dự đoán thời lượng" bar with the WPM presets. Nothing about a script
 * is entered outside the editor now — the topic, the platforms and the target
 * length are read from the project record itself.
 */
export default function Step01Script() {
  return (
    <StudioShell step="01">
      <div style={{ display: "flex", flexDirection: "column", gap: 6, height: "100%" }}>
        {/* Editor toolbar — the only strip above the editor */}
        <div style={{ ...panel, display: "flex", alignItems: "center", gap: 6, padding: "5px var(--unm-spacing-sm)" }}>
          <span style={{ fontSize: "0.578125rem", fontWeight: 700, color: "var(--unm-text)" }}>Kịch bản dự án</span>
          <div style={{ flex: 1 }} />
          <span style={{ ...chip, marginBottom: 0 }}>Lưu .md vào thư viện</span>
        </div>

        {/* The editor fills the screen */}
        <div style={{ ...panel, flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={{ ...label, marginBottom: 0, color: "var(--unm-primary)" }}>KỊCH BẢN: chủ đề dự án</span>
            <span style={chip}>1 Dòng</span>
            <span style={chip}>NỀN TẢNG • 45S — lấy từ dự án</span>
          </div>
          <div style={{ fontSize: "0.515625rem", color: "var(--unm-text-muted)", marginBottom: 6 }}>
            Bôi đen văn bản hoặc click số dòng để tô sáng phạm vi đang làm việc
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
            {["Văn bản (Số dòng)", "Storyboard Feed", "Lịch sử", "Sao chép", "Chấm Virality"].map((c) => (
              <span key={c} style={chip}>{c}</span>
            ))}
          </div>
          <div style={{ ...field, flex: 1, minHeight: 0, lineHeight: 1.5 }}>
            [Hook] Bạn có biết nấu cơm nhão không phải do nồi?...<br />
            [Nội dung] Tỷ lệ nước chuẩn 1:1.15...<br />
            [Turn] Không dùng đốt ngón tay đo nước...<br />
            [CTA] Lưu ngay để tối nay áp dụng!
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.5859375rem", color: "var(--unm-warning)" }}>☑ Nguồn gốc đã xác nhận (Source Rights)</span>
            <div style={{ flex: 1 }} />
            <span style={{ ...chip, marginBottom: 0 }}>Lưu Kịch Bản</span>
            <span style={{ ...chip, marginBottom: 0, color: "var(--unm-warning)", border: "1px solid var(--unm-warning)" }} data-unm-navigate="step02">
              Gate 1: Duyệt Kịch Bản → 02 AI Auto-Edit
            </span>
          </div>
        </div>
      </div>
    </StudioShell>
  )
}
