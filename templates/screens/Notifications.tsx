import { useState } from "react"

type NotificationItem = {
  id: number
  type: string
  title: string
  number?: number
  time: string
  unread: boolean
  navigate?: string
}

type NotificationGroup = {
  repo: string
  items: NotificationItem[]
}

const notificationGroups: NotificationGroup[] = [
  {
    repo: "octocat/react-starter",
    items: [
      { id: 1, type: "PR", title: "Refactor authentication to use OAuth2", number: 347, time: "3h ago", unread: true, navigate: "pullrequest" },
      { id: 2, type: "Issue", title: "OAuth2 callback fails on mobile Safari", number: 347, time: "5h ago", unread: true, navigate: "issues" },
      { id: 3, type: "CI", title: "CI passed on feature/oauth2", time: "6h ago", unread: false },
    ],
  },
  {
    repo: "octocat/api-toolkit",
    items: [
      { id: 4, type: "@", title: "@octocat mentioned you in Add rate limiting", number: 89, time: "1d ago", unread: true },
      { id: 5, type: "Review", title: "Review requested on Fix pagination", number: 92, time: "2d ago", unread: false },
    ],
  },
  {
    repo: "octocat/design-system",
    items: [
      { id: 6, type: "v", title: "v3.2.0 released", time: "3d ago", unread: false },
      { id: 7, type: "Issue", title: "Button component needs hover state", number: 45, time: "4d ago", unread: false },
    ],
  },
]

export default function Notifications() {
  const [filter, setFilter] = useState<"all" | "participating" | "mentions">("all")
  const [unreadOnly, setUnreadOnly] = useState(false)

  const filters = [
    { key: "all" as const, label: "All" },
    { key: "participating" as const, label: "Participating" },
    { key: "mentions" as const, label: "Mentions" },
  ]

  const filteredGroups = notificationGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !unreadOnly || item.unread),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <div
      style={{
        padding: "var(--unm-spacing-md)",
        background: "var(--unm-background)",
        minHeight: "100vh",
        fontFamily: "var(--unm-font-family)",
        boxSizing: "border-box",
      }}
    >
      {/* A. Mobile Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--unm-spacing-md)",
        }}
      >
        <button
          style={{
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--unm-text)",
            fontSize: 18,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          &#9776;
        </button>
        <h1
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "var(--unm-text)",
            margin: 0,
          }}
        >
          Notifications
        </h1>
        <button
          style={{
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--unm-text-muted)",
            fontSize: 18,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          &#9881;
        </button>
      </div>

      {/* B. Filter Pills */}
      <div
        style={{
          display: "flex",
          gap: "var(--unm-spacing-sm)",
          overflowX: "auto",
          marginBottom: "var(--unm-spacing-md)",
        }}
      >
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={
              filter === f.key
                ? {
                    background: "var(--unm-primary)",
                    color: "#fff",
                    borderRadius: "var(--unm-radius-full)",
                    padding: "var(--unm-spacing-xs) var(--unm-spacing-md)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    border: "none",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    fontFamily: "var(--unm-font-family)",
                  }
                : {
                    background: "var(--unm-surface)",
                    color: "var(--unm-text)",
                    borderRadius: "var(--unm-radius-full)",
                    padding: "var(--unm-spacing-xs) var(--unm-spacing-md)",
                    fontSize: "0.75rem",
                    border: "1px solid var(--unm-border)",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    fontFamily: "var(--unm-font-family)",
                  }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* C. Unread Toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--unm-spacing-lg)",
        }}
      >
        <span
          style={{
            fontSize: "0.875rem",
            color: "var(--unm-text)",
          }}
        >
          Only show unread
        </span>
        <button
          onClick={() => setUnreadOnly(!unreadOnly)}
          style={{
            width: 40,
            height: 20,
            borderRadius: "var(--unm-radius-full)",
            background: unreadOnly ? "var(--unm-primary)" : "var(--unm-surface-alt)",
            border: "none",
            cursor: "pointer",
            position: "relative",
            padding: 0,
            transition: "background 0.2s",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 2,
              left: unreadOnly ? 22 : 2,
              width: 16,
              height: 16,
              borderRadius: "var(--unm-radius-full)",
              background: "#fff",
              boxShadow: "var(--unm-shadow-sm)",
              transition: "left 0.2s",
            }}
          />
        </button>
      </div>

      {/* D. Notification Groups */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--unm-spacing-md)",
        }}
      >
        {filteredGroups.map((group) => (
          <div key={group.repo}>
            {/* Repo header */}
            <div
              style={{
                borderTop: "1px solid var(--unm-border)",
                paddingTop: "var(--unm-spacing-sm)",
                marginBottom: "var(--unm-spacing-sm)",
              }}
            >
              <span
                style={{
                  color: "var(--unm-text)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                {group.repo}
              </span>
            </div>

            {/* Notification items */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {group.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: "var(--unm-spacing-sm) var(--unm-spacing-md)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "var(--unm-spacing-sm)",
                    cursor: item.navigate ? "pointer" : undefined,
                  }}
                  {...(item.navigate ? { "data-unm-navigate": item.navigate } : {})}
                >
                  {/* Type badge */}
                  <span
                    style={{
                      fontSize: "0.75rem",
                      background: "var(--unm-surface-alt)",
                      color: "var(--unm-text-muted)",
                      borderRadius: "var(--unm-radius-sm)",
                      padding: "1px 6px",
                      marginTop: 2,
                      flexShrink: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {item.type}
                  </span>

                  {/* Content */}
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.875rem",
                        lineHeight: 1.4,
                        fontWeight: item.unread ? 600 : 400,
                        color: "var(--unm-text)",
                        margin: 0,
                      }}
                    >
                      {item.title}
                      {item.number != null && (
                        <span
                          style={{
                            color: "var(--unm-text-muted)",
                            fontWeight: 400,
                          }}
                        >
                          {" "}
                          #{item.number}
                        </span>
                      )}
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--unm-text-muted)",
                        marginTop: 2,
                        margin: 0,
                        paddingTop: 2,
                      }}
                    >
                      {item.time}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {item.unread && (
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "var(--unm-radius-full)",
                        background: "var(--unm-primary)",
                        flexShrink: 0,
                        marginTop: 6,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* E. Footer */}
      <button
        style={{
          width: "100%",
          marginTop: "var(--unm-spacing-lg)",
          padding: "var(--unm-spacing-sm) var(--unm-spacing-md)",
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "var(--unm-text)",
          border: "1px solid var(--unm-border)",
          borderRadius: "var(--unm-radius-md)",
          background: "var(--unm-surface)",
          cursor: "pointer",
          fontFamily: "var(--unm-font-family)",
        }}
      >
        Mark all as read
      </button>
    </div>
  )
}
