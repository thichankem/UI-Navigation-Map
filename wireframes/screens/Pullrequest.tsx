import { useState } from "react"

export default function PullRequest() {
  const [activeTab, setActiveTab] = useState<"conversation" | "commits" | "files">("conversation")

  return (
    <div
      style={{
        background: "var(--unm-background)",
        minHeight: "100vh",
        fontFamily: "var(--unm-font-family)",
      }}
    >
      {/* Nav bar */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--unm-surface)",
          borderBottom: "1px solid var(--unm-border)",
          padding: `var(--unm-spacing-sm) var(--unm-spacing-md)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--unm-spacing-sm)" }}>
          <div
            style={{
              width: 28,
              height: 28,
              background: "var(--unm-primary)",
              color: "#fff",
              borderRadius: "var(--unm-radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 11,
            }}
          >
            GH
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--unm-spacing-sm)" }}>
          <button
            data-unm-navigate="notifications"
            style={{
              width: 28,
              height: 28,
              borderRadius: "var(--unm-radius-md)",
              background: "var(--unm-surface-alt)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--unm-text-muted)",
              fontSize: 12,
              border: "1px solid var(--unm-border)",
              cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.9A4.5 4.5 0 0 0 3.5 6.4c0 .8-.2 3.1-1 4.6h11c-.8-1.5-1-3.8-1-4.6A4.5 4.5 0 0 0 8 1.9z" />
            </svg>
          </button>
          <button
            data-unm-navigate="profile"
            style={{
              width: 28,
              height: 28,
              borderRadius: "var(--unm-radius-full)",
              background: "var(--unm-primary)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}
          >
            OS
          </button>
        </div>
      </nav>

      <div style={{ padding: "var(--unm-spacing-md)" }}>
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--unm-spacing-xs)",
            fontSize: 12,
            marginBottom: "var(--unm-spacing-sm)",
          }}
        >
          <span style={{ color: "var(--unm-text-muted)" }}>octocat</span>
          <span style={{ color: "var(--unm-text-muted)" }}>/</span>
          <a
            data-unm-navigate="repo"
            style={{ color: "var(--unm-primary)", fontWeight: 500, cursor: "pointer" }}
          >
            react-starter
          </a>
        </div>

        {/* PR Title */}
        <h1
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--unm-text)",
            lineHeight: 1.3,
            marginTop: 0,
            marginBottom: "var(--unm-spacing-xs)",
          }}
        >
          Refactor authentication to use OAuth2 providers
          <span
            style={{
              color: "var(--unm-text-muted)",
              fontWeight: 300,
              marginLeft: "var(--unm-spacing-xs)",
            }}
          >
            #347
          </span>
        </h1>

        {/* Status + meta */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--unm-spacing-xs)",
            flexWrap: "wrap",
            marginBottom: "var(--unm-spacing-md)",
          }}
        >
          <span
            style={{
              background: "var(--unm-success)",
              color: "#fff",
              fontSize: 10,
              borderRadius: "var(--unm-radius-full)",
              padding: "1px var(--unm-spacing-xs)",
              fontWeight: 600,
            }}
          >
            Open
          </span>
          <span style={{ fontSize: 12, color: "var(--unm-text-muted)" }}>
            <span style={{ fontWeight: 600, color: "var(--unm-text)" }}>octocat</span>
            {" "}→ merge into{" "}
            <code
              style={{
                background: "var(--unm-surface-alt)",
                borderRadius: "var(--unm-radius-md)",
                padding: "1px var(--unm-spacing-xs)",
                fontSize: 10,
                fontFamily: "monospace",
                color: "var(--unm-text)",
              }}
            >
              main
            </code>
            {" "}from{" "}
            <code
              style={{
                background: "var(--unm-surface-alt)",
                borderRadius: "var(--unm-radius-md)",
                padding: "1px var(--unm-spacing-xs)",
                fontSize: 10,
                fontFamily: "monospace",
                color: "var(--unm-text)",
              }}
            >
              feature/oauth2
            </code>
          </span>
        </div>

        {/* Tab bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--unm-spacing-sm)",
            borderBottom: "1px solid var(--unm-border)",
            marginBottom: "var(--unm-spacing-md)",
            overflowX: "auto",
          }}
        >
          {([
            { id: "conversation" as const, label: "Conversation", count: null },
            { id: "commits" as const, label: "Commits", count: 4 },
            { id: "files" as const, label: "Files", count: 12 },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                paddingBottom: "var(--unm-spacing-sm)",
                paddingLeft: "var(--unm-spacing-xs)",
                paddingRight: "var(--unm-spacing-xs)",
                paddingTop: 0,
                fontSize: 12,
                fontWeight: 500,
                borderBottom: activeTab === tab.id
                  ? "2px solid var(--unm-primary)"
                  : "2px solid transparent",
                color: activeTab === tab.id ? "var(--unm-text)" : "var(--unm-text-muted)",
                background: "transparent",
                border: "none",
                borderBottomStyle: "solid",
                borderBottomWidth: 2,
                borderBottomColor: activeTab === tab.id ? "var(--unm-primary)" : "transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "var(--unm-spacing-xs)",
                fontFamily: "var(--unm-font-family)",
              }}
            >
              {tab.label}
              {tab.count !== null && (
                <span
                  style={{
                    background: "var(--unm-surface-alt)",
                    color: "var(--unm-text-muted)",
                    fontSize: 10,
                    borderRadius: "var(--unm-radius-full)",
                    padding: "1px var(--unm-spacing-xs)",
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Sidebar info (compact, horizontal on mobile) */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--unm-spacing-sm)",
            marginBottom: "var(--unm-spacing-md)",
          }}
        >
          {/* Labels */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--unm-spacing-xs)" }}>
            <span
              style={{
                background: "var(--unm-info)",
                color: "#fff",
                fontSize: 10,
                borderRadius: "var(--unm-radius-full)",
                padding: "1px var(--unm-spacing-xs)",
                fontWeight: 500,
              }}
            >
              enhancement
            </span>
            <span
              style={{
                background: "var(--unm-secondary)",
                color: "#fff",
                fontSize: 10,
                borderRadius: "var(--unm-radius-full)",
                padding: "1px var(--unm-spacing-xs)",
                fontWeight: 500,
              }}
            >
              auth
            </span>
            <span
              style={{
                background: "var(--unm-error)",
                color: "#fff",
                fontSize: 10,
                borderRadius: "var(--unm-radius-full)",
                padding: "1px var(--unm-spacing-xs)",
                fontWeight: 500,
              }}
            >
              priority: high
            </span>
          </div>
        </div>

        {/* Reviewers + milestone compact bar */}
        <div
          style={{
            background: "var(--unm-surface)",
            border: "1px solid var(--unm-border)",
            borderRadius: "var(--unm-radius-lg)",
            padding: "var(--unm-spacing-sm)",
            marginBottom: "var(--unm-spacing-md)",
          }}
        >
          {/* Reviewers row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 12,
              marginBottom: "var(--unm-spacing-sm)",
            }}
          >
            <span style={{ color: "var(--unm-text-muted)", fontWeight: 500 }}>Reviewers</span>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--unm-spacing-sm)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "var(--unm-spacing-xs)" }}>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "var(--unm-radius-full)",
                    background: "var(--unm-success)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    fontWeight: 700,
                  }}
                >
                  SC
                </span>
                <span style={{ color: "var(--unm-success)", fontSize: 10 }}>✓</span>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "var(--unm-spacing-xs)" }}>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "var(--unm-radius-full)",
                    background: "var(--unm-warning)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    fontWeight: 700,
                  }}
                >
                  MR
                </span>
                <span style={{ color: "var(--unm-warning)", fontSize: 10 }}>●</span>
              </span>
            </div>
          </div>

          {/* Milestone row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 12,
              marginBottom: "var(--unm-spacing-sm)",
            }}
          >
            <span style={{ color: "var(--unm-text-muted)", fontWeight: 500 }}>Milestone</span>
            <span style={{ color: "var(--unm-text)", fontSize: 12 }}>v2.0 Release</span>
          </div>

          {/* Progress bar */}
          <div
            style={{
              width: "100%",
              height: 6,
              background: "var(--unm-surface-alt)",
              borderRadius: "var(--unm-radius-full)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "65%",
                height: "100%",
                background: "var(--unm-success)",
                borderRadius: "var(--unm-radius-full)",
              }}
            />
          </div>

          {/* Linked issues row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 12,
              marginTop: "var(--unm-spacing-sm)",
            }}
          >
            <span style={{ color: "var(--unm-text-muted)", fontWeight: 500 }}>Linked</span>
            <span style={{ color: "var(--unm-primary)", fontSize: 12 }}>Closes #298, #312</span>
          </div>
        </div>

        {/* Conversation thread */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--unm-spacing-md)" }}>
          {/* PR Description */}
          <div
            style={{
              background: "var(--unm-surface)",
              border: "1px solid var(--unm-border)",
              borderRadius: "var(--unm-radius-lg)",
              overflow: "hidden",
            }}
          >
            {/* Comment header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--unm-spacing-xs)",
                padding: `var(--unm-spacing-xs) var(--unm-spacing-sm)`,
                background: "var(--unm-surface-alt)",
                borderBottom: "1px solid var(--unm-border)",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "var(--unm-radius-full)",
                  background: "var(--unm-primary)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  fontWeight: 700,
                }}
              >
                OS
              </div>
              <span style={{ fontWeight: 600, fontSize: 12, color: "var(--unm-text)" }}>
                octocat
              </span>
              <span style={{ fontSize: 10, color: "var(--unm-text-muted)" }}>3h ago</span>
              <span
                style={{
                  marginLeft: "auto",
                  background: "var(--unm-surface)",
                  border: "1px solid var(--unm-border)",
                  color: "var(--unm-text-muted)",
                  fontSize: 10,
                  borderRadius: "var(--unm-radius-full)",
                  padding: "1px var(--unm-spacing-xs)",
                }}
              >
                Author
              </span>
            </div>

            {/* Comment body */}
            <div
              style={{
                padding: "var(--unm-spacing-sm)",
                fontSize: 12,
                color: "var(--unm-text)",
                lineHeight: 1.6,
              }}
            >
              <p style={{ margin: 0, marginBottom: "var(--unm-spacing-sm)" }}>
                This PR migrates our authentication system from custom JWT to industry-standard
                OAuth2 providers for better security and social login support.
              </p>
              <p style={{ fontWeight: 600, marginTop: 0, marginBottom: "var(--unm-spacing-xs)", fontSize: 12 }}>
                Changes:
              </p>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "var(--unm-spacing-md)",
                  fontSize: 12,
                  color: "var(--unm-text-muted)",
                  listStyleType: "disc",
                }}
              >
                <li style={{ marginBottom: 2 }}>Added GitHub and Google OAuth2 providers</li>
                <li style={{ marginBottom: 2 }}>Implemented token refresh flow</li>
                <li style={{ marginBottom: 2 }}>Updated session management</li>
                <li style={{ marginBottom: 2 }}>Added callback URL validation</li>
              </ul>
            </div>

            {/* Reactions */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--unm-spacing-xs)",
                padding: `var(--unm-spacing-xs) var(--unm-spacing-sm)`,
                borderTop: "1px solid var(--unm-border)",
              }}
            >
              {[
                { emoji: "\uD83D\uDC4D", count: 5 },
                { emoji: "❤️", count: 2 },
                { emoji: "\uD83D\uDE80", count: 1 },
              ].map((reaction) => (
                <span
                  key={reaction.emoji}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--unm-spacing-xs)",
                    background: "var(--unm-surface-alt)",
                    border: "1px solid var(--unm-border)",
                    borderRadius: "var(--unm-radius-full)",
                    padding: "1px var(--unm-spacing-xs)",
                    fontSize: 10,
                    color: "var(--unm-text-muted)",
                  }}
                >
                  {reaction.emoji} {reaction.count}
                </span>
              ))}
            </div>
          </div>

          {/* Comment 2 — sarahchen approved */}
          <div
            style={{
              background: "var(--unm-surface)",
              border: "1px solid var(--unm-border)",
              borderRadius: "var(--unm-radius-lg)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--unm-spacing-xs)",
                padding: `var(--unm-spacing-xs) var(--unm-spacing-sm)`,
                background: "var(--unm-surface-alt)",
                borderBottom: "1px solid var(--unm-border)",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "var(--unm-radius-full)",
                  background: "var(--unm-success)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  fontWeight: 700,
                }}
              >
                SC
              </div>
              <span style={{ fontWeight: 600, fontSize: 12, color: "var(--unm-text)" }}>
                sarahchen
              </span>
              <span style={{ fontSize: 10, color: "var(--unm-text-muted)" }}>2h ago</span>
              <span
                style={{
                  marginLeft: "auto",
                  background: "var(--unm-success)",
                  color: "#fff",
                  fontSize: 10,
                  borderRadius: "var(--unm-radius-full)",
                  padding: "1px var(--unm-spacing-xs)",
                  fontWeight: 600,
                }}
              >
                Approved
              </span>
            </div>
            <div
              style={{
                padding: "var(--unm-spacing-sm)",
                fontSize: 12,
                color: "var(--unm-text)",
                lineHeight: 1.6,
              }}
            >
              Looks great overall! The callback URL validation is solid. Left a few comments on the
              token refresh logic.
            </div>
          </div>

          {/* Comment 3 — mikerivera changes requested */}
          <div
            style={{
              background: "var(--unm-surface)",
              border: "1px solid var(--unm-border)",
              borderRadius: "var(--unm-radius-lg)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--unm-spacing-xs)",
                padding: `var(--unm-spacing-xs) var(--unm-spacing-sm)`,
                background: "var(--unm-surface-alt)",
                borderBottom: "1px solid var(--unm-border)",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "var(--unm-radius-full)",
                  background: "var(--unm-warning)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  fontWeight: 700,
                }}
              >
                MR
              </div>
              <span style={{ fontWeight: 600, fontSize: 12, color: "var(--unm-text)" }}>
                mikerivera
              </span>
              <span style={{ fontSize: 10, color: "var(--unm-text-muted)" }}>45m ago</span>
              <span
                style={{
                  marginLeft: "auto",
                  background: "var(--unm-warning)",
                  color: "#fff",
                  fontSize: 10,
                  borderRadius: "var(--unm-radius-full)",
                  padding: "1px var(--unm-spacing-xs)",
                  fontWeight: 600,
                }}
              >
                Changes requested
              </span>
            </div>
            <div
              style={{
                padding: "var(--unm-spacing-sm)",
                fontSize: 12,
                color: "var(--unm-text)",
                lineHeight: 1.6,
              }}
            >
              Can we add error handling for the case where the provider returns an invalid scope?
              Seen this with enterprise GitHub setups.
            </div>
          </div>

          {/* Review banner */}
          <div
            style={{
              background: "var(--unm-surface-alt)",
              border: "1px solid var(--unm-border)",
              borderRadius: "var(--unm-radius-lg)",
              padding: `var(--unm-spacing-xs) var(--unm-spacing-sm)`,
              display: "flex",
              alignItems: "center",
              gap: "var(--unm-spacing-xs)",
            }}
          >
            <span style={{ color: "var(--unm-warning)", fontSize: 12 }}>●</span>
            <span style={{ fontSize: 12, color: "var(--unm-text)" }}>
              <span style={{ fontWeight: 600 }}>mikerivera</span> requested changes — 2 comments
            </span>
          </div>

          {/* Comment box */}
          <div
            style={{
              background: "var(--unm-surface)",
              border: "1px solid var(--unm-border)",
              borderRadius: "var(--unm-radius-lg)",
              padding: "var(--unm-spacing-sm)",
            }}
          >
            <textarea
              placeholder="Leave a comment..."
              style={{
                width: "100%",
                background: "var(--unm-background)",
                border: "1px solid var(--unm-border)",
                borderRadius: "var(--unm-radius-md)",
                padding: "var(--unm-spacing-sm)",
                fontSize: 12,
                color: "var(--unm-text)",
                resize: "none",
                minHeight: 60,
                boxSizing: "border-box",
                fontFamily: "var(--unm-font-family)",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "var(--unm-spacing-xs)",
                marginTop: "var(--unm-spacing-xs)",
              }}
            >
              <button
                style={{
                  padding: `var(--unm-spacing-xs) var(--unm-spacing-sm)`,
                  fontSize: 10,
                  fontWeight: 500,
                  border: "1px solid var(--unm-border)",
                  borderRadius: "var(--unm-radius-md)",
                  color: "var(--unm-text)",
                  background: "var(--unm-surface)",
                  cursor: "pointer",
                  fontFamily: "var(--unm-font-family)",
                }}
              >
                Comment
              </button>
              <button
                style={{
                  padding: `var(--unm-spacing-xs) var(--unm-spacing-sm)`,
                  fontSize: 10,
                  fontWeight: 500,
                  borderRadius: "var(--unm-radius-md)",
                  background: "var(--unm-success)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--unm-font-family)",
                }}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
