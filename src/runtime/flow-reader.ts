import fs from "fs"

/**
 * Extracts the top-level `name` field from flows.ts source.
 */
export function extractProjectName(flowsSource: string): string | undefined {
  const match = flowsSource.match(/\bname:\s*["']([^"']+)["']/)
  return match?.[1]
}

/**
 * Reads the project name from a flows.ts file, if the file exists.
 */
export function readProjectName(flowsPath: string): string | undefined {
  if (!fs.existsSync(flowsPath)) return undefined
  return extractProjectName(fs.readFileSync(flowsPath, "utf-8"))
}