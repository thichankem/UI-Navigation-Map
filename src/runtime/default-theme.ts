import type { NavigationMapTheme } from "../types"

export const DEFAULT_THEME: NavigationMapTheme = {
  colors: {
    primary: "#2563EB",
    secondary: "#7C3AED",
    accent: "#F59E0B",
    background: "#FFFFFF",
    surface: "#F8FAFC",
    surfaceAlt: "#F1F5F9",
    border: "#E2E8F0",
    text: "#0F172A",
    textMuted: "#64748B",
    textInvert: "#FFFFFF",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },
  darkColors: {
    background: "#0F172A",
    surface: "#1E293B",
    surfaceAlt: "#334155",
    border: "#475569",
    text: "#F1F5F9",
    textMuted: "#94A3B8",
    textInvert: "#0F172A",
  },
  radius: { sm: "4px", md: "8px", lg: "12px", xl: "16px", full: "9999px" },
  spacing: { xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px", xxl: "48px" },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    heading: { weight: 600, sizes: { h1: "2rem", h2: "1.5rem", h3: "1.25rem", h4: "1.125rem" } },
    body: { weight: 400, sizes: { base: "1rem", sm: "0.875rem", xs: "0.75rem" } },
  },
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px rgba(0,0,0,0.07)",
    lg: "0 10px 15px rgba(0,0,0,0.1)",
  },
}
