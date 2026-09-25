import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

/**
 * Directory of the current module. Works in both ESM (import.meta.url)
 * and CJS (import.meta is empty in CJS output, so fall back to __dirname).
 */
function getModuleDir(): string {
  try {
    return path.dirname(fileURLToPath(import.meta.url))
  } catch {
    return typeof __dirname !== "undefined" ? __dirname : process.cwd()
  }
}

/**
 * Resolves the ui-navigation-map package root. Works both from src/
 * (development) and from dist/ (published package).
 */
export function resolvePackageRoot(): string {
  let root = path.resolve(getModuleDir(), "..")
  if (!fs.existsSync(path.join(root, "package.json"))) {
    root = path.resolve(getModuleDir(), "../..")
  }
  return root
}

/**
 * Absolute path to the App component entry, forward-slash normalized
 * for use in Vite module IDs.
 */
export function resolveAppPath(): string {
  return path.resolve(resolvePackageRoot(), "src/app/App").replace(/\\/g, "/")
}

/**
 * Resolves the templates directory used by `ui-navigation-map init`.
 */
export function resolveTemplatesDir(): string {
  return path.join(resolvePackageRoot(), "templates")
}