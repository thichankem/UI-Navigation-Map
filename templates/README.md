# Wireframes

This directory is managed by [UI Navigation Map](https://github.com/thichankem/UI-Navigation-Map) — a Figma-like canvas where every screen is a real React component.

## Getting Started

```bash
npx ui-navigation-map dev
```

This opens an infinite canvas at `localhost:4800` showing all your screens as live thumbnails with navigation arrows between them.

## How It Works

```
wireframes/
├── screens/              # Each .tsx file = one screen on the canvas
│   ├── Explore.tsx
│   ├── Repo.tsx
│   └── ...
├── public/               # Static assets (images, fonts, etc.)
├── flows.ts              # Screen layout + navigation edges
├── unm.theme.ts   # Design tokens (colors, spacing, radii, shadows)
├── styles.css            # Tailwind v4 integration (optional)
├── AGENTS.md             # AI agent conventions (Codex, Antigravity, ...)
├── CLAUDE.md             # Claude Code (mirrored from AGENTS.md)
├── GEMINI.md             # Gemini CLI / Antigravity (mirrored)
├── .cursor/rules/        # Cursor rules (mirrored)
├── .github/              # GitHub Copilot instructions (mirrored)
├── .windsurf/rules/      # Windsurf rules (mirrored)
├── .clinerules           # Cline rules (mirrored)
├── .roo/rules/           # Roo Code rules (mirrored)
└── README.md             # This file
```

## Adding a Screen

1. Create `screens/MyScreen.tsx` with a default-exported React component:

```tsx
export default function MyScreen() {
  return (
    <div style={{ background: "var(--unm-background)", minHeight: "100vh", fontFamily: "var(--unm-font-family)" }}>
      <h1 style={{ color: "var(--unm-text)" }}>My Screen</h1>
      <button data-unm-navigate="otherscreen">Go somewhere</button>
    </div>
  )
}
```

2. Register it in `flows.ts`:

```ts
screens: {
  myscreen: {                          // ID = lowercase filename without .tsx
    title: "My Screen",
    file: "./screens/MyScreen.tsx",
    position: { x: 0, y: 0 },         // auto-updated when you drag on the canvas
    viewport: "desktop",               // "desktop" | "tablet" | "mobile"
  },
},
```

3. The canvas hot-reloads — your new screen appears immediately.

## Key Concepts

- **`data-unm-navigate="screenId"`** — marks any element as a navigation trigger. Renders as a flow arrow on the canvas. Clicking it in the viewer navigates to that screen.
- **`var(--unm-*)`** — theme tokens for colors, spacing, radii, shadows, fonts. Use these instead of hardcoding values. Dark mode works automatically.
- **Screen IDs** — lowercase filename without `.tsx`. `Profile.tsx` → `profile`. Must match exactly in `flows.ts` and `data-unm-navigate`.
- **Local state** — `useState`, modals, dropdowns, and tabs all work normally inside the viewer.

## Images & Static Assets

Place images, fonts, and other static files in the `public/` directory. Reference them with absolute paths:

```tsx
<img src="/hero.png" alt="Hero" />
<img src="/icons/arrow.svg" alt="Arrow" />
```

You can also import assets directly in your screen components — Vite will bundle them automatically:

```tsx
import logo from "./logo.png"

export default function Home() {
  return <img src={logo} alt="Logo" />
}
```

## Theming

Edit `unm.theme.ts` to change colors, spacing, radii, shadows, and typography. Changes hot-reload instantly. See `CLAUDE.md` for the full token reference.

## Learn More

- Repository: [UI-Navigation-Map](https://github.com/thichankem/UI-Navigation-Map)
- AI conventions: see `CLAUDE.md` in this directory
