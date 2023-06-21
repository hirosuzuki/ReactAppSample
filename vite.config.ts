import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "webapp/",
  build: {
    rollupOptions: {
      plugins: [visualizer({
        filename: "rollup-plugin-visualizer.html",
      })],
    },
    outDir: "./dist", //出力場所の指定
  },
  resolve: {
    alias: {
      "@/": `${__dirname}/webapp/src/`,
    },
  },
});
