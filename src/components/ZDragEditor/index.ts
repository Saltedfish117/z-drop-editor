import type { App } from "vue";
import ZArea from "@/components/ZArea/index.ts";
import ZBtn from "@/components/ZBtn/index.ts";
import ZContextMenu from "@/components/ZContextMenu/index.ts";
import ZDesign from "@/components/ZDesign/index.ts";
import ZDrag from "@/components/ZDrag/index.ts";
import ZDragEditorCanvas from "@/components/ZDragEditorCanvas/index.ts";
import ZGroup from "@/components/ZGroup/index.ts";
import ZIcon from "@/components/ZIcon/index.ts";
import ZMaterialList from "@/components/ZMaterialList/index.ts";
import ZNode from "@/components/ZNode/index.ts";
import ZPage from "@/components/ZPage/index.ts";
import ZPageList from "@/components/ZPageList/index.ts";
import ZPopup from "@/components/ZPopup/index.ts";
import ZScaleController from "@/components/ZScaleController/index.ts";
import ZSplitter from "@/components/ZSplitter/index.ts";
import ZTextField from "@/components/ZTextField/index.ts";
import ZToolbar from "@/components/ZToolbar/index.ts";
import ZTree from "@/components/ZTree/index.ts";
import ZDragEditor from "@/components/ZDragEditor/ZDragEditor.vue";
export * from "./type";
const components = [
  ZArea,
  ZBtn,
  ZContextMenu,
  ZDesign,
  ZDrag,
  ZDragEditorCanvas,
  ZGroup,
  ZIcon,
  ZMaterialList,
  ZNode,
  ZPage,
  ZPageList,
  ZPopup,
  ZScaleController,
  ZSplitter,
  ZTextField,
  ZToolbar,
  ZTree,
];
ZDragEditor.install = (app: App) => {
  app.component("ZDragEditor", ZDragEditor);
  components.forEach((component) => {
    app.use(component);
  });
};
export default ZDragEditor;
