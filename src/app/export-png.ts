import { toPng } from "html-to-image"
import { getNodesBounds, getViewportForBounds } from "@xyflow/react"
import type { Node } from "@xyflow/react"

/** Target resolution dimensions for full canvas high-res snapshot */
const CANVAS_WIDTH = 2048
const CANVAS_HEIGHT = 1536

/**
 * Transforms an arbitrary string (e.g. project name) into a safe,
 * lowercased, hyphen-separated filename slug.
 *
 * @param name - Raw input string
 * @returns Clean slugified string
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Options for exporting the canvas view to PNG.
 */
export interface ExportCanvasOptions {
  /** Canvas background fill color (defaults to '#ffffff') */
  backgroundColor?: string
  /** Project name used as filename prefix */
  projectName?: string
}

/**
 * Helper to trigger browser download of a base64 or blob data URL.
 *
 * @param dataUrl - Base64 image data URL
 * @param filename - Target filename for download
 */
function downloadDataUrl(dataUrl: string, filename: string): void {
  const anchor = document.createElement("a")
  anchor.href = dataUrl
  anchor.download = filename
  anchor.click()
}

/**
 * Captures the entire React Flow viewport including all positioned screen nodes
 * and flow arrows, rendering a high-resolution PNG image.
 *
 * @param getNodes - Function returning all active nodes on canvas
 * @param options - Export options (background color, project prefix)
 */
export async function exportCanvasPng(
  getNodes: () => Node[],
  options?: ExportCanvasOptions,
): Promise<void> {
  const viewportEl = document.querySelector<HTMLElement>(".react-flow__viewport")
  if (!viewportEl) return

  const nodes = getNodes()
  const bounds = getNodesBounds(nodes)
  const viewport = getViewportForBounds(
    bounds,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    0.5,
    2,
    0.1,
  )

  const dataUrl = await toPng(viewportEl, {
    backgroundColor: options?.backgroundColor ?? "#ffffff",
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    style: {
      width: `${CANVAS_WIDTH}px`,
      height: `${CANVAS_HEIGHT}px`,
      transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
    },
  })

  const prefix = options?.projectName ? slugify(options.projectName) : "ui-navigation-map"
  downloadDataUrl(dataUrl, `${prefix}-canvas.png`)
}

/**
 * Captures an individual screen at 100% full native resolution (unscaled),
 * suitable for presentations, design docs, or design reviews.
 *
 * @param screenId - Identifier of the screen to snapshot
 * @param projectName - Optional project name for filename prefix
 */
export async function exportScreenPng(
  screenId: string,
  projectName?: string,
): Promise<void> {
  const wrapper = document.querySelector<HTMLElement>(
    `[data-unm-screen-id="${screenId}"]`,
  )
  if (!wrapper) return

  const contentEl = wrapper.querySelector<HTMLElement>("[data-unm-screen-content]")
  if (!contentEl) return

  const width = parseInt(contentEl.style.width, 10)
  const height = parseInt(contentEl.style.height, 10)

  const dataUrl = await toPng(contentEl, {
    width,
    height,
    style: {
      transform: "none",
    },
  })

  const prefix = projectName ? slugify(projectName) : "ui-navigation-map"
  downloadDataUrl(dataUrl, `${prefix}-${screenId}.png`)
}
