# UI Navigation Map — Wireframes

This directory contains wireframe screens visualized on an infinite canvas via UI Navigation Map.

## Directory Structure
```
wireframes/
├── screens/          # React component screens (.tsx)
├── public/           # Static assets — images, fonts, icons (served at /)
├── flows.ts          # Screen metadata + navigation edges
├── unm.theme.ts  # Design tokens → CSS custom properties
├── styles.css        # (optional) Tailwind v4 integration
└── AGENTS.md         # This file (mirrored to CLAUDE.md, GEMINI.md, and other agent files)
```

## Creating Screens

Each screen is a **default-exported React component** with **zero required props**.

```tsx
export default function MyScreen() {
  return (
    <div style={{ background: "var(--unm-background)", minHeight: "100vh", fontFamily: "var(--unm-font-family)" }}>
      <h1 style={{ color: "var(--unm-text)" }}>Screen Title</h1>
      <button data-unm-navigate="otherscreen">Go to Other</button>
    </div>
  )
}
```

### Rules
1. **One default export per file** — the component IS the screen
2. **No required props** — screens receive no props from UI Navigation Map
3. **Use `var(--unm-*)` tokens** for all colors, spacing, radii, shadows, and fonts — never hardcode values like `#fff` or `16px`
4. **`data-unm-navigate="screenId"`** on any element marks it as a navigation trigger (renders as a flow arrow on the canvas, navigates in the viewer)
5. **Local state works** — `useState`, modals, dropdowns, tabs all function normally inside the viewer
6. **File → ID mapping**: the screen ID is the **lowercase filename** without `.tsx`. `Profile.tsx` → `profile`, `PullRequest.tsx` → `pullrequest`. Use this exact ID in `flows.ts` and `data-unm-navigate` attributes. No hyphens or transformations.

### Available Theme Tokens

All tokens are CSS custom properties prefixed with `--unm-`:

| Category | Tokens |
|---|---|
| **Colors** | `--unm-primary`, `--unm-secondary`, `--unm-accent`, `--unm-background`, `--unm-surface`, `--unm-surface-alt`, `--unm-border`, `--unm-text`, `--unm-text-muted`, `--unm-text-invert`, `--unm-success`, `--unm-warning`, `--unm-error`, `--unm-info` |
| **Dark overrides** | `--unm-background`, `--unm-surface`, `--unm-surface-alt`, `--unm-border`, `--unm-text`, `--unm-text-muted`, `--unm-text-invert` (auto-applied when dark mode toggled) |
| **Radius** | `--unm-radius-sm` (4px), `--unm-radius-md` (8px), `--unm-radius-lg` (12px), `--unm-radius-xl` (16px), `--unm-radius-full` (9999px) |
| **Spacing** | `--unm-spacing-xs` (4px), `--unm-spacing-sm` (8px), `--unm-spacing-md` (16px), `--unm-spacing-lg` (24px), `--unm-spacing-xl` (32px), `--unm-spacing-xxl` (48px) |
| **Typography** | `--unm-font-family`, `--unm-heading-weight`, `--unm-heading-h1`..`h4`, `--unm-body-weight`, `--unm-body-base`, `--unm-body-sm`, `--unm-body-xs` |
| **Shadows** | `--unm-shadow-sm`, `--unm-shadow-md`, `--unm-shadow-lg` |

### Dark Mode

Dark mode works automatically when you use `var(--unm-*)` tokens. UI Navigation Map generates:

```css
:root                            { --unm-background: #FFFFFF; --unm-text: #0F172A; ... }
[data-unm-color-scheme="dark"]    { --unm-background: #0F172A; --unm-text: #F1F5F9; ... }
```

When a screen is toggled to dark, its wrapper gets `data-unm-color-scheme="dark"`, and all descendant `var(--unm-*)` references resolve to dark values. **No code changes needed** — just don't hardcode colors.

### Images & Static Assets

- **`public/` directory** — files here are served at `/`. Use `<img src="/hero.png" />` to reference them. No import needed.
- **Direct imports** — `import logo from "./logo.png"` in a screen file also works. Vite handles bundling.
- Prefer `public/` for assets shared across screens, and direct imports for screen-specific assets.

## Registering Screens in `flows.ts`

```ts
import type { NavigationMapConfig } from "ui-navigation-map"

const config: NavigationMapConfig = {
  name: "My App",
  screens: {
    myscreen: {                          // ID = lowercase filename
      title: "My Screen",               // Display name on canvas
      file: "./screens/MyScreen.tsx",    // Relative path from this dir
      position: { x: 0, y: 0 },         // Canvas coordinates (auto-updated on drag)
      viewport: "desktop",              // "desktop" (1440x900) | "tablet" (768x1024) | "mobile" (390x844)
      color: "#4488ff",                 // Optional accent color for the screen card
    },
  },
  edges: [
    { from: "myscreen", to: "otherscreen", label: "Navigate" },
  ],
}

export default config
```

### Screen ID Matching (Critical)
The screen scanner generates IDs by stripping `.tsx` and lowercasing: `Explore.tsx` → `explore`, `PullRequest.tsx` → `pullrequest`. The ID in `flows.ts`, `data-unm-navigate`, and `edges` must match exactly. Mismatched IDs show "No preview".

## Tailwind CSS (Optional)

If `styles.css` exists in this directory, Tailwind v4 is active automatically. Create it with `ui-navigation-map init --tailwind` or manually:

```css
@import "tailwindcss";

@theme inline {
  --color-primary: var(--unm-primary);
  --color-secondary: var(--unm-secondary);
  --color-background: var(--unm-background);
  --color-surface: var(--unm-surface);
  --color-text: var(--unm-text);
  --color-text-muted: var(--unm-text-muted);
  --color-border: var(--unm-border);
  --radius-md: var(--unm-radius-md);
  --radius-lg: var(--unm-radius-lg);
  --spacing-md: var(--unm-spacing-md);
  --shadow-sm: var(--unm-shadow-sm);
  /* ... */
}
```

Then use `bg-primary`, `text-text-muted`, `p-md`, `rounded-lg`, `shadow-sm`, etc. Dark mode cascades automatically.

**Important:** Must use `@theme inline`, not plain `@theme`. Without `inline`, Tailwind v4 generates `@property` declarations that eagerly resolve `var()` references at `:root`, breaking the dark mode cascade.

## Editing the Theme

Edit `unm.theme.ts` directly — changes hot-reload instantly. The file defines `colors`, `darkColors`, `radius`, `spacing`, `typography`, and `shadows`. All values are mapped to `--unm-*` CSS custom properties.

## Running

```bash
npx ui-navigation-map dev          # Open the canvas (default port 4800)
npx ui-navigation-map dev --port 5000  # Custom port
```
