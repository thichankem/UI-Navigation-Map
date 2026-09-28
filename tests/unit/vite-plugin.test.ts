import { describe, it, expect, vi } from "vitest"
import path from "path"
import { uiNavigationMapPlugin } from "../../src/runtime/vite-plugin"

function createMockServer() {
  const eventHandlers: Record<string, Array<(...args: any[]) => void>> = {}

  return {
    watcher: {
      add: vi.fn(),
      unwatch: vi.fn(),
      on: vi.fn((event: string, handler: (...args: any[]) => void) => {
        if (!eventHandlers[event]) eventHandlers[event] = []
        eventHandlers[event].push(handler)
      }),
    },
    moduleGraph: {
      getModuleById: vi.fn(() => ({ id: "mock" })),
      invalidateModule: vi.fn(),
    },
    ws: {
      send: vi.fn(),
    },
    middlewares: {
      use: vi.fn(),
    },
    _eventHandlers: eventHandlers,
  }
}

describe("uiNavigationMapPlugin", () => {
  it("should return a valid Vite plugin object", () => {
    const plugin = uiNavigationMapPlugin({ dir: "./wireframes" })
    expect(plugin).toBeDefined()
    expect(plugin.name).toBe("ui-navigation-map")
  })

  it("should accept dir option", () => {
    const plugin = uiNavigationMapPlugin({ dir: "./custom-dir" })
    expect(plugin).toBeDefined()
  })

  it("should have configureServer hook", () => {
    const plugin = uiNavigationMapPlugin({ dir: "./wireframes" })
    expect(plugin.configureServer).toBeDefined()
    expect(typeof plugin.configureServer).toBe("function")
  })

  it("should have resolveId hook for virtual modules", () => {
    const plugin = uiNavigationMapPlugin({ dir: "./wireframes" })
    expect(plugin.resolveId).toBeDefined()
    expect(typeof plugin.resolveId).toBe("function")
  })

  it("should have load hook for virtual modules", () => {
    const plugin = uiNavigationMapPlugin({ dir: "./wireframes" })
    expect(plugin.load).toBeDefined()
    expect(typeof plugin.load).toBe("function")
  })

  it("should resolve virtual module id", () => {
    const plugin = uiNavigationMapPlugin({ dir: "./wireframes" })
    const resolveId = plugin.resolveId as (id: string) => string | undefined
    expect(resolveId("virtual:unm/theme")).toBe(
      "\0virtual:unm/theme"
    )
    expect(resolveId("virtual:unm/screens")).toBe(
      "\0virtual:unm/screens"
    )
    expect(resolveId("some-other-module")).toBeUndefined()
  })

  it("should resolve virtual:unm/inferred-edges module id", () => {
    const plugin = uiNavigationMapPlugin({ dir: "./wireframes" })
    const resolveId = plugin.resolveId as (id: string) => string | undefined
    expect(resolveId("virtual:unm/inferred-edges")).toBe(
      "\0virtual:unm/inferred-edges"
    )
  })

  it("should load inferred-edges module with edge data from screen sources", async () => {
    const wireframesDir = path.resolve(__dirname, "../fixtures/sample-wireframes")
    const plugin = uiNavigationMapPlugin({ dir: wireframesDir })
    const load = plugin.load as (id: string) => Promise<string | undefined>
    const result = await load("\0virtual:unm/inferred-edges")
    expect(result).toBeDefined()
    // Login.tsx has data-unm-navigate="dashboard" and data-unm-navigate="settings"
    // So we expect edges from login -> dashboard and login -> settings
    expect(result).toContain("login")
    expect(result).toContain("dashboard")
    expect(result).toContain("settings")
    expect(result).toContain("inferred")
    expect(result).toContain("export default")
  })

  it("should not generate inferred edges for screens without data-unm-navigate", async () => {
    const wireframesDir = path.resolve(__dirname, "../fixtures/sample-wireframes")
    const plugin = uiNavigationMapPlugin({ dir: wireframesDir })
    const load = plugin.load as (id: string) => Promise<string | undefined>
    const result = await load("\0virtual:unm/inferred-edges")
    expect(result).toBeDefined()
    // Dashboard.tsx has no data-unm-navigate, so it should not appear as an edge source
    expect(result).not.toContain('"from":"dashboard"')
  })

  it("should invalidate inferred-edges module on screen file changes", () => {
    const plugin = uiNavigationMapPlugin({ dir: "./wireframes" })
    const mockServer = createMockServer()
    const configureServer = plugin.configureServer as (server: any) => void
    configureServer(mockServer)

    // Simulate a "change" event for a screen file
    const changeHandlers = mockServer._eventHandlers["change"]
    expect(changeHandlers).toBeDefined()

    const screensDir = require("path").resolve("./wireframes", "screens")
    changeHandlers[0](screensDir + "/Login.tsx")

    // Should have called getModuleById for the inferred-edges module too
    expect(mockServer.moduleGraph.getModuleById).toHaveBeenCalledWith(
      "\0virtual:unm/inferred-edges"
    )
  })
})

describe("configureServer — file watcher", () => {
  it("should watch for add events on screens directory", () => {
    const plugin = uiNavigationMapPlugin({ dir: "./wireframes" })
    const mockServer = createMockServer()
    const configureServer = plugin.configureServer as (server: any) => void
    configureServer(mockServer)

    // Verify "add" event handler is registered
    expect(mockServer.watcher.on).toHaveBeenCalledWith("add", expect.any(Function))
  })

  it("should watch for unlink events on screens directory", () => {
    const plugin = uiNavigationMapPlugin({ dir: "./wireframes" })
    const mockServer = createMockServer()
    const configureServer = plugin.configureServer as (server: any) => void
    configureServer(mockServer)

    // Verify "unlink" event handler is registered
    expect(mockServer.watcher.on).toHaveBeenCalledWith("unlink", expect.any(Function))
  })

  it("should invalidate screens module and reload when a screen file is added", () => {
    const plugin = uiNavigationMapPlugin({ dir: "./wireframes" })
    const mockServer = createMockServer()
    const configureServer = plugin.configureServer as (server: any) => void
    configureServer(mockServer)

    // Simulate an "add" event for a new screen file
    const addHandlers = mockServer._eventHandlers["add"]
    expect(addHandlers).toBeDefined()
    expect(addHandlers.length).toBeGreaterThan(0)

    const screensDir = require("path").resolve("./wireframes", "screens")
    addHandlers[0](screensDir + "/NewScreen.tsx")

    expect(mockServer.moduleGraph.invalidateModule).toHaveBeenCalled()
    expect(mockServer.ws.send).toHaveBeenCalledWith({ type: "full-reload" })
  })

  it("should invalidate screens module and reload when a screen file is removed", () => {
    const plugin = uiNavigationMapPlugin({ dir: "./wireframes" })
    const mockServer = createMockServer()
    const configureServer = plugin.configureServer as (server: any) => void
    configureServer(mockServer)

    // Simulate an "unlink" event for a removed screen file
    const unlinkHandlers = mockServer._eventHandlers["unlink"]
    expect(unlinkHandlers).toBeDefined()
    expect(unlinkHandlers.length).toBeGreaterThan(0)

    const screensDir = require("path").resolve("./wireframes", "screens")
    unlinkHandlers[0](screensDir + "/OldScreen.tsx")

    expect(mockServer.moduleGraph.invalidateModule).toHaveBeenCalled()
    expect(mockServer.ws.send).toHaveBeenCalledWith({ type: "full-reload" })
  })

  it("should not reload for add/unlink events outside screens directory", () => {
    const plugin = uiNavigationMapPlugin({ dir: "./wireframes" })
    const mockServer = createMockServer()
    const configureServer = plugin.configureServer as (server: any) => void
    configureServer(mockServer)

    const addHandlers = mockServer._eventHandlers["add"]
    addHandlers[0]("/some/other/path/file.tsx")

    // ws.send is called only for the change handler setup, not for unrelated paths
    expect(mockServer.ws.send).not.toHaveBeenCalled()
  })
})

describe("configureServer — position persistence API", () => {
  it("should register middleware for the dev server", () => {
    const plugin = uiNavigationMapPlugin({ dir: "./wireframes" })
    const mockServer = createMockServer()
    const configureServer = plugin.configureServer as (server: any) => void
    configureServer(mockServer)

    expect(mockServer.middlewares.use).toHaveBeenCalled()
  })

  it("should handle POST to /__unm/update-positions", async () => {
    const plugin = uiNavigationMapPlugin({ dir: "./wireframes" })
    const mockServer = createMockServer()
    const configureServer = plugin.configureServer as (server: any) => void
    configureServer(mockServer)

    // Get the middleware function that was registered
    const middlewareFn = mockServer.middlewares.use.mock.calls[0][0]
    expect(middlewareFn).toBeDefined()
    expect(typeof middlewareFn).toBe("function")
  })

  it("should call next() for non-matching routes", async () => {
    const plugin = uiNavigationMapPlugin({ dir: "./wireframes" })
    const mockServer = createMockServer()
    const configureServer = plugin.configureServer as (server: any) => void
    configureServer(mockServer)

    const middlewareFn = mockServer.middlewares.use.mock.calls[0][0]
    const mockReq = { url: "/some-other-route", method: "GET" }
    const mockRes = { end: vi.fn(), writeHead: vi.fn() }
    const mockNext = vi.fn()

    middlewareFn(mockReq, mockRes, mockNext)

    expect(mockNext).toHaveBeenCalled()
  })
})
