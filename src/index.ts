// Types
export type {
  NavigationMapConfig,
  ScreenConfig,
  EdgeConfig,
  Viewport,
  ColorScheme,
  CanvasAppearance,
  BackgroundStyle,
  LineStyle,
  CanvasSettings,
  ThemeColors,
  NavigationMapTheme,
} from "./types"

export { DEFAULT_CANVAS_SETTINGS, ACCENT_COLORS } from "./types"

// Runtime
export { scanScreens, extractNavigationTargets } from "./runtime/screen-scanner"
export { uiNavigationMapPlugin } from "./runtime/vite-plugin"

// App components
export { App } from "./app/App"
export { Canvas } from "./app/Canvas"
export { Viewer } from "./app/Viewer"
export { ScreenNode } from "./app/ScreenNode"
export { FlowEdge } from "./app/FlowEdge"
