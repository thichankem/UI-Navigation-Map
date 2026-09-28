import { defineConfig } from "tsup"

export default defineConfig([
  {
    entry: { index: "src/index.ts" },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    external: ["react", "react-dom", "@xyflow/react"],
  },
  {
    entry: { cli: "bin/cli.ts" },
    format: ["esm"],
    banner: { js: "#!/usr/bin/env node" },
    sourcemap: true,
    external: ["react", "react-dom", "@xyflow/react", "vite", "cac", "tailwindcss", "@tailwindcss/vite"],
  },
])
