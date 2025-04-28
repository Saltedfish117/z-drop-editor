import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import libCss from "vite-plugin-libcss";
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), libCss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("/Icons/")) {
            return "icons";
          }
        },
      },
    },
  },
});
