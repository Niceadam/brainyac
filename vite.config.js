import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    outDir: "docs"
  },
  esbuild: {
    jsx: "transform",
    jsxFactory: "m",
    jsxFragment: "'['",
  },
});
