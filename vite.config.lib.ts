import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import libCss from "vite-plugin-libcss";
import dts from "vite-plugin-dts";
export default defineConfig({
  plugins: [
    vue(),
    libCss(),
    dts({
      rollupTypes: true, // 合并类型
      tsconfigPath: "./tsconfig.app.json",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  build: {
    outDir: "lib", 
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"), // 入口文件
      name: "ZDropEditor", // 库的全局变量名
      fileName: (format) => `z-drop-editor.${format === 'es' ? 'es' : 'umd'}.js`, // 输出文件名
      formats: ["es", "umd"],
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
        // 禁用代码分割，因为 UMD 格式不支持
        inlineDynamicImports: true,
      },
      input: {
        main: path.resolve(__dirname, "src/index.ts"), // 入口文件
      },
    },
    cssCodeSplit: true,
  },
});
