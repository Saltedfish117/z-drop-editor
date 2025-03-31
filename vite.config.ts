import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import libCss from "vite-plugin-libcss";
import dts from "vite-plugin-dts";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    libCss(),
    dts({
      rollupTypes: true, // 合并类型
      tsconfigPath: "./tsconfig.json",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"), // 入口文件
      name: "ZDropEditor", // 库的全局变量名
      fileName: (format) => `z-drop-editor.${format}.js`, // 输出文件名
      formats: ["es"],
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
        inlineDynamicImports: false,
        manualChunks: (id) => {
          if (id.includes("/Icons/")) {
            return "icons";
          }
        },
      },
      input: {
        main: path.resolve(__dirname, "src/index.ts"), // 入口文件
        ZArea: path.resolve(__dirname, "src/components/ZArea/index.ts"),
        ZBtn: path.resolve(__dirname, "src/components/ZBtn/index.ts"),
        ZContextMenu: path.resolve(
          __dirname,
          "src/components/ZContextMenu/index.ts"
        ),
        ZDesign: path.resolve(__dirname, "src/components/ZDesign/index.ts"),
        ZDrag: path.resolve(__dirname, "src/components/ZDrag/index.ts"),
        ZDragEditor: path.resolve(
          __dirname,
          "src/components/ZDragEditor/index.ts"
        ),
        ZDragEditorCanvas: path.resolve(
          __dirname,
          "src/components/ZDragEditorCanvas/index.ts"
        ),
        ZGroup: path.resolve(__dirname, "src/components/ZGroup/index.ts"),
        ZIcon: path.resolve(__dirname, "src/components/ZIcon/index.ts"),
        ZMaterialList: path.resolve(
          __dirname,
          "src/components/ZMaterialList/index.ts"
        ),
        ZNode: path.resolve(__dirname, "src/components/ZNode/index.ts"),
        ZPage: path.resolve(__dirname, "src/components/ZPage/index.ts"),
        ZPageList: path.resolve(__dirname, "src/components/ZPageList/index.ts"),
        ZPopup: path.resolve(__dirname, "src/components/ZPopup/index.ts"),
        ZScaleController: path.resolve(
          __dirname,
          "src/components/ZScaleController/index.ts"
        ),
        ZSplitter: path.resolve(__dirname, "src/components/ZSplitter/index.ts"),
        ZTextField: path.resolve(
          __dirname,
          "src/components/ZTextField/index.ts"
        ),
        ZToolbar: path.resolve(__dirname, "src/components/ZToolbar/index.ts"),
        ZTree: path.resolve(__dirname, "src/components/ZTree/index.ts"),
      },
    },
    cssCodeSplit: true,
  },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@import "@/var.css";`,
  //     },
  //   },
  // },
});
