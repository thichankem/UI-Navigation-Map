import type { Viewport } from "../types"

function post(path: string, payload: unknown): void {
  fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {})
}

export function updateScreenViewport(screenId: string, viewport: Viewport): void {
  post("/__unm/update-viewport", { screenId, viewport })
}

export function updateScreenColor(screenId: string, color: string): void {
  post("/__unm/update-color", { screenId, color })
}