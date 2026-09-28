import type { NavigationMapTheme } from "ui-navigation-map"

const theme: NavigationMapTheme = {
  colors: {
    primary: "#22d3ee",
    secondary: "#a78bfa",
    accent: "#fbbf24",
    background: "#07090e",
    surface: "#0d1322",
    surfaceAlt: "#121a2c",
    border: "#1e293b",
    text: "#e5e7eb",
    textMuted: "#94a3b8",
    textInvert: "#07090e",
    success: "#34d399",
    warning: "#fbbf24",
    error: "#fb7185",
    info: "#38bdf8",
  },
  darkColors: {
    background: "#07090e",
    surface: "#0d1322",
    surfaceAlt: "#121a2c",
    border: "#1e293b",
    text: "#e5e7eb",
    textMuted: "#94a3b8",
    textInvert: "#07090e",
  },
  radius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    heading: {
      weight: 700,
      sizes: { h1: "1.5rem", h2: "1.25rem", h3: "1.125rem", h4: "1rem" },
    },
    body: {
      weight: 400,
      sizes: { base: "0.8125rem", sm: "0.6875rem", xs: "0.625rem" },
    },
  },
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.3)",
    md: "0 4px 6px rgba(0,0,0,0.4)",
    lg: "0 10px 15px rgba(0,0,0,0.5)",
  },
}

export default theme