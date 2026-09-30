import { useState } from "react"

const trendingRepos = [
  {
    rank: 1,
    owner: "vercel",
    name: "next.js",
    desc: "The React Framework for the Web",
    lang: "TypeScript",
    langColor: "var(--unm-info)",
    stars: "128k",
    todayStars: 342,
  },
  {
    rank: 2,
    owner: "denoland",
    name: "deno",
    desc: "A modern runtime for JS and TS",
    lang: "Rust",
    langColor: "var(--unm-error)",
    stars: "97.8k",
    todayStars: 287,
  },
  {
    rank: 3,
    owner: "anthropics",
    name: "claude-sdk",
    desc: "Official SDK for the Claude API",
    lang: "TypeScript",
    langColor: "var(--unm-info)",
    stars: "12.4k",
    todayStars: 256,
  },
  {
    rank: 4,
    owner: "tailwindlabs",
    name: "tailwindcss",
    desc: "A utility-first CSS framework",
    lang: "TypeScript",
    langColor: "var(--unm-info)",
    stars: "85.2k",
    todayStars: 198,
  },
  {
    rank: 5,
    owner: "rustlang",
    name: "rust",
    desc: "Empowering everyone to build reliable software",
    lang: "Rust",
    langColor: "var(--unm-error)",
    stars: "99.1k",
    todayStars: 175,
  },
]

const trendingDevs = [
  { rank: 1, avatar: "OS", username: "octocat", name: "The Octocat", repo: "react-starter" },
  { rank: 2, avatar: "SC", username: "sarahchen", name: "Sarah Chen", repo: "go-microservice" },
  { rank: 3, avatar: "MR", username: "mikerivera", name: "Mike Rivera", repo: "ml-pipeline" },
]

const topics = ["react", "machine-learning", "devtools", "web3", "rust", "ai", "typescript", "cloud"]

export default function Explore() {
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("today")

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
      {/* A. Search Bar */}
      <input
        type="text"
        placeholder="Search repositories, users..."
        style={{
          width: "100%",
          background: "var(--unm-surface)",
          border: "1px solid var(--unm-border)",
          borderRadius: "var(--unm-radius-full)",
          padding: "var(--unm-spacing-sm) var(--unm-spacing-md)",
          fontSize: "0.875rem",
          color: "var(--unm-text)",
          marginBottom: "var(--unm-spacing-md)",
          boxSizing: "border-box",
          outline: "none",
        }}
      />

      {/* B. Explore Heading */}
      <h1
        style={{
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "var(--unm-text)",
          margin: "0 0 var(--unm-spacing-md) 0",
        }}
      >
        Explore
      </h1>

      {/* C. Topic Tags */}
      <div
        style={{
          overflowX: "auto",
          display: "flex",
          gap: "var(--unm-spacing-xs)",
          paddingBottom: "var(--unm-spacing-sm)",
          marginBottom: "var(--unm-spacing-md)",
        }}
      >
        {topics.map((topic) => (
          <span
            key={topic}
            style={{
              background: "var(--unm-surface-alt)",
              color: "var(--unm-primary)",
              fontSize: "0.75rem",
              borderRadius: "var(--unm-radius-full)",
              padding: "var(--unm-spacing-xs) var(--unm-spacing-sm)",
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            {topic}
          </span>
        ))}
      </div>

      {/* D. Trending Repositories Section */}
      <div style={{ marginBottom: "var(--unm-spacing-lg)" }}>
        <h2
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "var(--unm-text)",
            margin: "0 0 var(--unm-spacing-sm) 0",
          }}
        >
          Trending
        </h2>

        {/* Time range pills */}
        <div
          style={{
            display: "flex",
            gap: "var(--unm-spacing-xs)",
            marginBottom: "var(--unm-spacing-sm)",
          }}
        >
          {(
            [
              { key: "today", label: "Today" },
              { key: "week", label: "This week" },
              { key: "month", label: "This month" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTimeRange(key)}
              style={{
                borderRadius: "var(--unm-radius-full)",
                padding: "var(--unm-spacing-xs) var(--unm-spacing-md)",
                fontSize: "0.75rem",
                cursor: "pointer",
                border: timeRange === key ? "none" : "1px solid var(--unm-border)",
                background: timeRange === key ? "var(--unm-primary)" : "var(--unm-surface)",
                color: timeRange === key ? "#fff" : "var(--unm-text)",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Language filter button */}
        <button
          style={{
            background: "var(--unm-surface)",
            border: "1px solid var(--unm-border)",
            borderRadius: "var(--unm-radius-md)",
            padding: "var(--unm-spacing-xs) var(--unm-spacing-sm)",
            fontSize: "0.75rem",
            color: "var(--unm-text-muted)",
            marginBottom: "var(--unm-spacing-md)",
            cursor: "pointer",
          }}
        >
          All languages &#9662;
        </button>

        {/* Trending repo cards */}
        <div>
          {trendingRepos.map((repo) => (
            <div
              key={repo.rank}
              style={{
                borderBottom: "1px solid var(--unm-border)",
                padding: "var(--unm-spacing-md) 0",
              }}
            >
              {/* Row 1: Rank, owner/name, star button */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    color: "var(--unm-text-muted)",
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    marginRight: "var(--unm-spacing-md)",
                    width: "1.5rem",
                    flexShrink: 0,
                  }}
                >
                  {repo.rank}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ color: "var(--unm-text-muted)", fontSize: "0.875rem" }}>
                    {repo.owner}
                  </span>
                  <span style={{ color: "var(--unm-text-muted)", fontSize: "0.875rem" }}>
                    {" / "}
                  </span>
                  {repo.rank === 1 ? (
                    <span
                      data-unm-navigate="repo"
                      style={{
                        color: "var(--unm-primary)",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {repo.name}
                    </span>
                  ) : (
                    <span
                      style={{
                        color: "var(--unm-primary)",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                      }}
                    >
                      {repo.name}
                    </span>
                  )}
                </div>
                <button
                  style={{
                    background: "var(--unm-surface)",
                    border: "1px solid var(--unm-border)",
                    borderRadius: "var(--unm-radius-md)",
                    padding: "2px var(--unm-spacing-sm)",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    color: "var(--unm-text)",
                    flexShrink: 0,
                  }}
                >
                  Star
                </button>
              </div>

              {/* Row 2: Description */}
              <div style={{ marginLeft: "calc(1.5rem + var(--unm-spacing-md))" }}>
                <p
                  style={{
                    color: "var(--unm-text-muted)",
                    fontSize: "0.75rem",
                    margin: "4px 0 0 0",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {repo.desc}
                </p>
              </div>

              {/* Row 3: Language, stars, today stars */}
              <div
                style={{
                  marginLeft: "calc(1.5rem + var(--unm-spacing-md))",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--unm-spacing-sm)",
                  marginTop: 4,
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--unm-spacing-xs)",
                    fontSize: "0.75rem",
                    color: "var(--unm-text-muted)",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "var(--unm-radius-full)",
                      background: repo.langColor,
                      display: "inline-block",
                    }}
                  />
                  {repo.lang}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--unm-text-muted)" }}>
                  &#9733; {repo.stars}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--unm-text-muted)" }}>
                  &#9733; {repo.todayStars} today
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* E. Trending Developers Section */}
      <div style={{ marginTop: "var(--unm-spacing-lg)", marginBottom: "var(--unm-spacing-md)" }}>
        <h2
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--unm-text)",
            margin: "0 0 var(--unm-spacing-md) 0",
          }}
        >
          Trending developers
        </h2>

        {trendingDevs.map((dev) => (
          <div
            key={dev.rank}
            style={{
              padding: "var(--unm-spacing-sm) 0",
              borderBottom: "1px solid var(--unm-border)",
              display: "flex",
              alignItems: "center",
              gap: "var(--unm-spacing-sm)",
            }}
          >
            {/* Rank */}
            <span
              style={{
                color: "var(--unm-text-muted)",
                fontSize: "0.875rem",
                fontWeight: 700,
                width: "1.25rem",
                flexShrink: 0,
              }}
            >
              {dev.rank}
            </span>

            {/* Avatar circle */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--unm-radius-full)",
                background: "var(--unm-surface-alt)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--unm-text-muted)",
                fontSize: "0.75rem",
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {dev.avatar}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: "var(--unm-text)", fontSize: "0.875rem", fontWeight: 700, margin: 0 }}>
                {dev.username}
              </p>
              <p style={{ color: "var(--unm-text-muted)", fontSize: "0.75rem", margin: 0 }}>
                {dev.name}
              </p>
              <p
                style={{
                  color: "var(--unm-primary)",
                  fontSize: "0.75rem",
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {dev.repo}
              </p>
            </div>

            {/* Follow button */}
            <button
              style={{
                background: "var(--unm-surface)",
                border: "1px solid var(--unm-border)",
                borderRadius: "var(--unm-radius-md)",
                padding: "2px var(--unm-spacing-sm)",
                fontSize: "0.75rem",
                cursor: "pointer",
                color: "var(--unm-text)",
                flexShrink: 0,
              }}
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
