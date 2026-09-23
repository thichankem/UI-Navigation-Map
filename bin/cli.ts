import cac from "cac"
import pkg from "../package.json"
import { runInit } from "../src/cli/init"
import { runDev } from "../src/cli/dev"
import { runExport } from "../src/cli/export"

const cli = cac("designflow")

cli
  .command("init [dir]", "Scaffold wireframes directory with example screens")
  .option("--tailwind", "Include Tailwind CSS (default: true)", { default: true })
  .option("--no-tailwind", "Skip Tailwind CSS")
  .option("--name <name>", "Project name")
  .action(async (dir, options) => {
    const targetDir = dir || "./wireframes"
    try {
      await runInit({ dir: targetDir, tailwind: options.tailwind, name: options.name })
      const screenDir = `${targetDir}/screens/`
      console.log()
      console.log(`  DesignFlow scaffolded in ${targetDir}/`)
      console.log()
      console.log("  Next steps:")
      console.log()
      console.log("    npx designflow dev")
      console.log()
      console.log(`  This opens an infinite canvas at http://localhost:4800`)
      console.log(`  showing your screens as live React thumbnails.`)
      console.log()
      console.log("  To add a screen:")
      console.log(`    1. Create a .tsx file in ${screenDir}`)
      console.log(`    2. Register it in ${targetDir}/flows.ts`)
      console.log()
      console.log(`  Edit ${targetDir}/designflow.theme.ts to customize colors, spacing, and more.`)
      if (options.tailwind) {
        console.log(`  Tailwind v4 is active — use classes like bg-primary, text-text, p-md.`)
      }
      console.log()
      console.log(`  Docs: https://designflow.cc`)
      console.log(`  AI conventions: ${targetDir}/AGENTS.md`)
      console.log(`  (also mirrored to CLAUDE.md, GEMINI.md, Cursor, Copilot, Windsurf, Cline, Roo Code)`)
      console.log()
    } catch (err: any) {
      console.error(`Error: ${err.message}`)
      process.exit(1)
    }
  })

cli
  .command("dev", "Start the canvas dev server")
  .option("--dir <dir>", "Wireframes directory", { default: "./wireframes" })
  .option("--port <port>", "Dev server port", { default: 4800 })
  .action(async (options) => {
    try {
      await runDev({ dir: options.dir, port: Number(options.port) })
    } catch (err: any) {
      console.error(`Error: ${err.message}`)
      process.exit(1)
    }
  })

cli
  .command("export", "Export static HTML file")
  .option("--dir <dir>", "Wireframes directory", { default: "./wireframes" })
  .option("--output <output>", "Output file path", { default: "./designflow.html" })
  .action(async (options) => {
    try {
      await runExport({ dir: options.dir, output: options.output })
    } catch (err: any) {
      console.error(`Error: ${err.message}`)
      process.exit(1)
    }
  })

cli.help()
cli.version(pkg.version)
cli.parse()
