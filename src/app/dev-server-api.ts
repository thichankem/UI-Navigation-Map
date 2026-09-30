import type { Viewport } from "../types"

/**
 * Sends a lightweight JSON POST request to the local Vite dev server runtime.
 * Catches any network errors silently (e.g. when run in static export or offline mode).
 *
 * @param path - API endpoint path (e.g. '/__unm/update-viewport')
 * @param payload - Serialized JSON body
 */
function post(path: string, payload: unknown): void {
  fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {
    // Fail silently when disconnected or running as static bundle
  })
}

/**
 * Persists the preferred viewport (desktop, tablet, mobile) of a screen
 * to the project's flows.ts configuration file.
 *
 * @param screenId - Target screen identifier
 * @param viewport - Viewport preset ('desktop' | 'tablet' | 'mobile')
 */
export function updateScreenViewport(screenId: string, viewport: Viewport): void {
  post("/__unm/update-viewport", { screenId, viewport })
}

/**
 * Persists the chosen custom accent/border color of a screen
 * to the project's flows.ts configuration file.
 *
 * @param screenId - Target screen identifier
 * @param color - Hex color code (e.g. '#22d3ee')
 */
export function updateScreenColor(screenId: string, color: string): void {
  post("/__unm/update-color", { screenId, color })
}
