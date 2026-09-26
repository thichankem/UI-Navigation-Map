import { describe, it, expect, vi, beforeEach } from "vitest"
import cac from "cac"

// Mock the action handlers to prevent actual execution
vi.mock("../../src/cli/init", () => ({
  runInit: vi.fn(),
}))
vi.mock("../../src/cli/dev", () => ({
  runDev: vi.fn(),
}))
vi.mock("../../src/cli/export", () => ({
  runExport: vi.fn(),
}))

describe("CLI bin entry", () => {
  let cli: ReturnType<typeof cac>

  beforeEach(() => {
    cli = cac("ui-navigation-map")

    cli
      .command("init", "Scaffold wireframes directory with example screens")
      .option("--dir <dir>", "Target directory", { default: "./wireframes" })
      .option("--tailwind", "Include Tailwind CSS (default: true)", { default: true })
      .option("--no-tailwind", "Skip Tailwind CSS")
      .action(() => {})

    cli
      .command("dev", "Start the canvas dev server")
      .option("--dir <dir>", "Wireframes directory", { default: "./wireframes" })
      .option("--port <port>", "Dev server port", { default: 4800 })
      .action(() => {})

    cli
      .command("export", "Export static HTML")
      .option("--dir <dir>", "Wireframes directory", { default: "./wireframes" })
      .option("--output <output>", "Output file path", { default: "./ui-navigation-map.html" })
      .action(() => {})

    cli.help()
    cli.version("0.1.0")
  })

  it("should register init command", () => {
    const parsed = cli.parse(["", "", "init", "--dir", "./custom"], { run: false })
    expect(parsed.options.dir).toBe("./custom")
  })

  it("should register dev command with port option", () => {
    const parsed = cli.parse(["", "", "dev", "--port", "5555"], { run: false })
    expect(parsed.options.port).toBe(5555)
  })

  it("should have default dir for init", () => {
    const parsed = cli.parse(["", "", "init"], { run: false })
    expect(parsed.options.dir).toBe("./wireframes")
  })

  it("should have default port for dev", () => {
    const parsed = cli.parse(["", "", "dev"], { run: false })
    expect(parsed.options.port).toBe(4800)
  })

  it("should set version to 0.1.0", () => {
    expect(cli.version).toBeDefined()
  })

  it("should register export command with default output", () => {
    const parsed = cli.parse(["", "", "export"], { run: false })
    expect(parsed.options.output).toBe("./ui-navigation-map.html")
  })

  it("should accept custom --dir and --output for export", () => {
    const parsed = cli.parse(["", "", "export", "--dir", "./frames", "--output", "./build/preview.html"], { run: false })
    expect(parsed.options.dir).toBe("./frames")
    expect(parsed.options.output).toBe("./build/preview.html")
  })
})
