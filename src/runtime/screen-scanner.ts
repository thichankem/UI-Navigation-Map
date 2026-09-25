import fs from "fs/promises"
import path from "path"

export interface ScannedScreen {
  id: string
  filename: string
  filePath: string
}

export async function scanScreens(dir: string): Promise<ScannedScreen[]> {
  let entries: string[]
  try {
    entries = await fs.readdir(dir)
  } catch {
    return []
  }

  return entries
    .filter((entry) => entry.endsWith(".tsx"))
    .map((filename) => ({
      id: filename.replace(/\.tsx$/, "").toLowerCase(),
      filename,
      filePath: path.join(dir, filename),
    }))
}

export function extractNavigationTargets(source: string): string[] {
  const regex = /data-unm-navigate=["']([^"']+)["']/g
  const targets = new Set<string>()
  let match: RegExpExecArray | null

  while ((match = regex.exec(source)) !== null) {
    targets.add(match[1])
  }

  return [...targets]
}
