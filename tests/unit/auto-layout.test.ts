import { describe, it, expect } from "vitest"
import { computeAutoLayout } from "../../src/app/auto-layout"
import type { NavigationMapConfig, EdgeConfig } from "../../src/types"

const baseConfig: NavigationMapConfig = {
  screens: {
    login: { title: "Login", file: "./screens/Login.tsx", position: { x: 0, y: 0 } },
    dashboard: { title: "Dashboard", file: "./screens/Dashboard.tsx", position: { x: 450, y: 0 } },
    settings: { title: "Settings", file: "./screens/Settings.tsx", position: { x: 900, y: 0 } },
  },
  edges: [
    { from: "login", to: "dashboard", label: "Sign in" },
    { from: "dashboard", to: "settings", label: "Gear" },
  ],
}

describe("computeAutoLayout", () => {
  it("should return a position for every screen", () => {
    const layout = computeAutoLayout(baseConfig)
    expect(Object.keys(layout).sort()).toEqual(["dashboard", "login", "settings"])
  })

  it("should lay out a chain left-to-right by layer", () => {
    const layout = computeAutoLayout(baseConfig)
    expect(layout.login.x).toBeLessThan(layout.dashboard.x)
    expect(layout.dashboard.x).toBeLessThan(layout.settings.x)
  })

  it("should place nodes in the same layer at the same x", () => {
    const branched: NavigationMapConfig = {
      screens: {
        home: { title: "Home", file: "./screens/Home.tsx", position: { x: 0, y: 0 } },
        a: { title: "A", file: "./screens/A.tsx", position: { x: 0, y: 0 } },
        b: { title: "B", file: "./screens/B.tsx", position: { x: 0, y: 0 } },
      },
      edges: [
        { from: "home", to: "a", label: "1" },
        { from: "home", to: "b", label: "2" },
      ],
    }
    const layout = computeAutoLayout(branched)
    expect(layout.a.x).toBe(layout.b.x)
    expect(layout.home.x).toBeLessThan(layout.a.x)
  })

  it("should spread nodes within a layer vertically", () => {
    const branched: NavigationMapConfig = {
      screens: {
        home: { title: "Home", file: "./screens/Home.tsx", position: { x: 0, y: 0 } },
        a: { title: "A", file: "./screens/A.tsx", position: { x: 0, y: 0 } },
        b: { title: "B", file: "./screens/B.tsx", position: { x: 0, y: 0 } },
      },
      edges: [
        { from: "home", to: "a", label: "1" },
        { from: "home", to: "b", label: "2" },
      ],
    }
    const layout = computeAutoLayout(branched)
    expect(layout.a.y).not.toBe(layout.b.y)
  })

  it("should handle cycles without hanging", () => {
    const cyclic: NavigationMapConfig = {
      screens: {
        a: { title: "A", file: "./screens/A.tsx", position: { x: 0, y: 0 } },
        b: { title: "B", file: "./screens/B.tsx", position: { x: 0, y: 0 } },
      },
      edges: [
        { from: "a", to: "b", label: "1" },
        { from: "b", to: "a", label: "2" },
      ],
    }
    const layout = computeAutoLayout(cyclic)
    expect(layout.a).toBeDefined()
    expect(layout.b).toBeDefined()
    expect(typeof layout.a.x).toBe("number")
  })

  it("should ignore self-loops", () => {
    const selfLoop: NavigationMapConfig = {
      screens: {
        a: { title: "A", file: "./screens/A.tsx", position: { x: 0, y: 0 } },
      },
      edges: [{ from: "a", to: "a", label: "self" }],
    }
    const layout = computeAutoLayout(selfLoop)
    expect(typeof layout.a.x).toBe("number")
    expect(typeof layout.a.y).toBe("number")
  })

  it("should stack disconnected nodes in the first column", () => {
    const disconnected: NavigationMapConfig = {
      screens: {
        a: { title: "A", file: "./screens/A.tsx", position: { x: 0, y: 0 } },
        b: { title: "B", file: "./screens/B.tsx", position: { x: 0, y: 0 } },
      },
    }
    const layout = computeAutoLayout(disconnected)
    expect(layout.a.x).toBe(layout.b.x)
    expect(layout.a.y).not.toBe(layout.b.y)
  })

  it("should use inferred edges for layering when there are no explicit edges", () => {
    const noExplicit: NavigationMapConfig = {
      screens: {
        login: { title: "Login", file: "./screens/Login.tsx", position: { x: 0, y: 0 } },
        dashboard: { title: "Dashboard", file: "./screens/Dashboard.tsx", position: { x: 0, y: 0 } },
        settings: { title: "Settings", file: "./screens/Settings.tsx", position: { x: 0, y: 0 } },
      },
    }
    const inferred: EdgeConfig[] = [
      { from: "login", to: "dashboard", label: "navigate", inferred: true },
      { from: "dashboard", to: "settings", label: "navigate", inferred: true },
    ]
    const layout = computeAutoLayout(noExplicit, inferred)
    expect(layout.login.x).toBeLessThan(layout.dashboard.x)
    expect(layout.dashboard.x).toBeLessThan(layout.settings.x)
  })

  it("should prefer explicit edges over inferred edges for layering", () => {
    const inferred: EdgeConfig[] = [
      { from: "settings", to: "login", label: "back", inferred: true },
    ]
    const layout = computeAutoLayout(baseConfig, inferred)
    // Explicit chain login → dashboard → settings wins over the inferred back-edge
    expect(layout.login.x).toBeLessThan(layout.dashboard.x)
    expect(layout.dashboard.x).toBeLessThan(layout.settings.x)
  })

  it("should return an empty object for an empty config", () => {
    expect(computeAutoLayout({ screens: {} })).toEqual({})
  })

  it("should give desktop nodes wider columns than mobile nodes", () => {
    const mixed: NavigationMapConfig = {
      screens: {
        a: { title: "A", file: "./screens/A.tsx", position: { x: 0, y: 0 }, viewport: "desktop" },
        b: { title: "B", file: "./screens/B.tsx", position: { x: 0, y: 0 }, viewport: "mobile" },
      },
      edges: [{ from: "a", to: "b", label: "1" }],
    }
    const layout = computeAutoLayout(mixed)
    // Second column x offset grows with the first column's width
    expect(layout.b.x).toBeGreaterThan(0)
    expect(layout.b.x).toBeGreaterThan(layout.a.x)
  })
})