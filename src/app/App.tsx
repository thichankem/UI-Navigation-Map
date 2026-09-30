import { useState, useEffect } from "react"
import { ReactFlowProvider } from "@xyflow/react"
import { Canvas } from "./Canvas"
import { Viewer } from "./Viewer"
import { DEFAULT_CANVAS_SETTINGS } from "../types"
import type { NavigationMapConfig, EdgeConfig, CanvasSettings } from "../types"
import "@xyflow/react/dist/style.css"

/** Key used to store persistent canvas appearance settings in localStorage */
const SETTINGS_STORAGE_KEY = "unm-appearance"

/**
 * Safely retrieves stored appearance settings from browser localStorage
 * with graceful fallback to system defaults.
 */
function getInitialSettings(): CanvasSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed && typeof parsed === "object" && "appearance" in parsed) {
        return { ...DEFAULT_CANVAS_SETTINGS, ...parsed }
      }
    }
  } catch {
    // localStorage unavailable, disabled, or contains malformed JSON
  }
  return { ...DEFAULT_CANVAS_SETTINGS }
}

/**
 * Props for the root App component.
 */
interface AppProps {
  /** Project navigation map configuration */
  config: NavigationMapConfig
  /** Map of screen IDs to their React component implementations */
  screens: Record<string, React.ComponentType>
  /** Inferred navigation edges scanned by the dev server */
  inferredEdges?: EdgeConfig[]
  /** Flag indicating standalone static export distribution */
  exportMode?: boolean
}

/**
 * App is the top-level application component for UI Navigation Map.
 *
 * Responsibilities:
 * - Mounts ReactFlowProvider context.
 * - Manages viewer active/closed state and smooth return focus transitions.
 * - Synchronizes browser document title with project configuration.
 * - Handles persistent canvas settings (light/dark appearance, accent palette, etc.).
 */
export function App({
  config,
  screens,
  inferredEdges,
  exportMode,
}: AppProps) {
  const [viewingScreen, setViewingScreen] = useState<string | null>(null)
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null)
  const [settings, setSettings] = useState<CanvasSettings>(() =>
    exportMode ? { ...DEFAULT_CANVAS_SETTINGS } : getInitialSettings(),
  )

  // Synchronize browser tab title
  useEffect(() => {
    document.title = config.name
      ? `${config.name} — UI Navigation Map`
      : "UI Navigation Map"
  }, [config.name])

  const viewingConfig = viewingScreen ? config.screens[viewingScreen] : null

  // Transition from full-screen viewer back to canvas
  const handleCloseViewer = () => {
    setFocusNodeId(viewingScreen)
    setViewingScreen(null)
  }

  // Handle settings update and persist to browser storage
  const handleSettingsChange = exportMode
    ? undefined
    : (newSettings: CanvasSettings) => {
        setSettings(newSettings)
        try {
          localStorage.setItem(
            SETTINGS_STORAGE_KEY,
            JSON.stringify(newSettings),
          )
        } catch {
          // localStorage full or unavailable
        }
      }

  return (
    <ReactFlowProvider>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Infinite React Flow Canvas */}
        <Canvas
          config={config}
          screens={screens}
          onScreenSelect={setViewingScreen}
          focusNodeId={focusNodeId}
          inferredEdges={inferredEdges}
          settings={settings}
          onSettingsChange={handleSettingsChange}
          projectName={config.name}
          exportMode={exportMode}
        />

        {/* Interactive Fullscreen Screen Viewer */}
        {viewingScreen && viewingConfig && screens[viewingScreen] && (
          <Viewer
            key={viewingScreen}
            screenId={viewingScreen}
            screenTitle={viewingConfig.title}
            component={screens[viewingScreen]}
            onClose={handleCloseViewer}
            onNavigate={setViewingScreen}
            accentColor={settings.accentColor}
            color={viewingConfig.color}
            viewport={viewingConfig.viewport}
            projectName={config.name}
            exportMode={exportMode}
          />
        )}
      </div>
    </ReactFlowProvider>
  )
}
