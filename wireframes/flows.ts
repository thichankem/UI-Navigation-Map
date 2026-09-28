import type { NavigationMapConfig } from "ui-navigation-map"

const config: NavigationMapConfig = {
  name: "AI Content Factory — Unified Studio",
  screens: {
    launcher: {
      title: "0 · Project Launcher",
      file: "./screens/Launcher.tsx",
      position: { x: 0, y: -157.5 },
      viewport: "desktop",
      color: "#22d3ee",
    },
    modalsgallery: {
      title: "10 Global Modals",
      file: "./screens/ModalsGallery.tsx",
      position: { x: 4172, y: -365 },
      viewport: "desktop",
      color: "#fb7185",
    },
    step01script: {
      title: "STEP 01 · Script Studio",
      file: "./screens/Step01Script.tsx",
      position: { x: 1289.0058602566653, y: -199.89291416275995 },
      viewport: "desktop",
      color: "#38bdf8",
    },
    step02media: {
      title: "MỤC A · Tư liệu của dự án",
      file: "./screens/Step02Media.tsx",
      position: { x: 596, y: -567 },
      viewport: "desktop",
      color: "#38bdf8",
    },
    step03photo: {
      title: "STEP 03 · Photo Lab",
      file: "./screens/Step03Photo.tsx",
      position: { x: 4172, y: 40 },
      viewport: "desktop",
      color: "#38bdf8",
    },
    step05audio: {
      title: "STEP 05 · Audio Lab",
      file: "./screens/Step05Audio.tsx",
      position: { x: 2384, y: -162 },
      viewport: "desktop",
      color: "#38bdf8",
    },
    step06timeline: {
      title: "CHỨC NĂNG 04 · Edit video (Timeline NLE)",
      file: "./screens/Step06Timeline.tsx",
      position: { x: 2980, y: -162 },
      viewport: "desktop",
      color: "#38bdf8",
    },
    proeditor: {
      title: "Pro Editor (Step 03–06)",
      file: "./screens/ProEditor.tsx",
      position: { x: 3576, y: 40 },
      viewport: "desktop",
      color: "#fbbf24",
    },
    campaignempire: {
      title: "Utility · Content Empire",
      file: "./screens/CampaignEmpire.tsx",
      position: { x: 596, y: 243 },
      viewport: "desktop",
      color: "#fbbf24",
    },
  },

  edges: [
    { from: "launcher", to: "step01script", label: "Mở dự án" },
    { from: "launcher", to: "step02media", label: "Kho tri thức" },
    { from: "launcher", to: "modalsgallery", label: "Tạo dự án" },
    { from: "step01script", to: "step02media", label: "Bước 2" },
    { from: "step02media", to: "step03photo", label: "Bước 3" },
    { from: "step03photo", to: "step05audio", label: "Bước 5" },
    { from: "step05audio", to: "step06timeline", label: "Chức năng 04" },
    { from: "step03photo", to: "proeditor", label: "Mở Pro Editor" },
    { from: "step05audio", to: "proeditor", label: "Mở Pro Editor" },
    { from: "step06timeline", to: "proeditor", label: "Mở Pro Editor" },
    { from: "proeditor", to: "step03photo", label: "Thoát" },
    { from: "step01script", to: "campaignempire", label: "Campaign" },
    { from: "campaignempire", to: "step01script", label: "Quay lại" },
  ],
}

export default config
