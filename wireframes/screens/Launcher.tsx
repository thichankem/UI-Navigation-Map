export default function Launcher() {
  const card = {
    background: "var(--unm-surface)",
    border: "1px solid var(--unm-border)",
    borderRadius: "var(--unm-radius-lg)",
    padding: "var(--unm-spacing-md)",
    cursor: "pointer",
  }
  const btn = {
    background: "linear-gradient(135deg, var(--unm-primary), var(--unm-secondary))",
    color: "var(--unm-text-invert)",
    border: "none",
    borderRadius: "var(--unm-radius-md)",
    padding: "var(--unm-spacing-sm) var(--unm-spacing-md)",
    fontWeight: 700,
    fontSize: "0.8125rem",
    cursor: "pointer",
  }
  const chip = {
    background: "var(--unm-surface-alt)",
    border: "1px solid var(--unm-border)",
    borderRadius: "var(--unm-radius-full)",
    padding: "2px var(--unm-spacing-sm)",
    fontSize: "0.625rem",
    color: "var(--unm-text-muted)",
  }

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
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--unm-spacing-sm)", marginBottom: "var(--unm-spacing-lg)" }}>
        <div
          style={{
            width: 36, height: 36, borderRadius: "var(--unm-radius-md)",
            background: "linear-gradient(135deg, var(--unm-primary), var(--unm-secondary))",
            display: "grid", placeItems: "center", fontWeight: 900, color: "#000", fontSize: "0.75rem",
          }}
        >
          CF
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--unm-text)" }}>AI CONTENT FACTORY</div>
          <div style={{ fontSize: "0.625rem", color: "var(--unm-text-muted)", letterSpacing: 2 }}>UNIFIED STUDIO</div>
        </div>
      </div>

      {/* Hero 2 cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--unm-spacing-sm)", marginBottom: "var(--unm-spacing-lg)" }}>
        <div style={card} data-unm-navigate="modals">
          <div style={{ fontSize: "1.25rem" }}>🚀</div>
          <div style={{ fontWeight: 700, fontSize: "0.8125rem", color: "var(--unm-text)", margin: "4px 0 2px" }}>Tạo Dự Án Mới</div>
          <div style={{ fontSize: "0.625rem", color: "var(--unm-text-muted)" }}>NewProjectModal → pipeline 2 cổng duyệt</div>
        </div>
        <div style={card} data-unm-navigate="step02">
          <div style={{ fontSize: "1.25rem" }}>📚</div>
          <div style={{ fontWeight: 700, fontSize: "0.8125rem", color: "var(--unm-text)", margin: "4px 0 2px" }}>Thư Viện & Kho Tri Thức</div>
          <div style={{ fontSize: "0.625rem", color: "var(--unm-text-muted)" }}>Media bin · tài liệu · slide HTML</div>
        </div>
      </div>

      {/* Project list */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--unm-spacing-sm)" }}>
        <div style={{ fontWeight: 700, fontSize: "0.8125rem", color: "var(--unm-text)" }}>Danh Sách Tất Cả Dự Án</div>
        <button style={btn} data-unm-navigate="step01">Mở dự án →</button>
      </div>

      <div style={{ display: "flex", gap: "var(--unm-spacing-xs)", marginBottom: "var(--unm-spacing-sm)", flexWrap: "wrap" }}>
        {["Tất cả", "Nháp", "Chờ duyệt kịch bản", "Đang sản xuất", "Chờ duyệt video", "Đã xuất bản"].map((s) => (
          <span key={s} style={chip}>{s}</span>
        ))}
      </div>

      {/* Sample project cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--unm-spacing-sm)" }}>
        {[
          { name: "TAM Flight 3054", status: "Đã xuất bản", dot: "var(--unm-success)" },
          { name: "Bí ẩn Edward Bernays 1928", status: "Chờ duyệt video", dot: "var(--unm-warning)" },
          { name: "Mẹo nấu cơm không nhão", status: "Nháp", dot: "var(--unm-text-muted)" },
          { name: "MH370 — 10 năm im lặng", status: "Đang sản xuất", dot: "var(--unm-secondary)" },
        ].map((p) => (
          <div key={p.name} style={{ ...card, display: "flex", alignItems: "center", gap: "var(--unm-spacing-sm)" }} data-unm-navigate="step01">
            <span style={{ width: 8, height: 8, borderRadius: "var(--unm-radius-full)", background: p.dot, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: "0.75rem", color: "var(--unm-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
              <div style={{ fontSize: "0.625rem", color: "var(--unm-text-muted)" }}>{p.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}