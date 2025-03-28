import type { ZDragNodes, ZCanvasList } from "@/common/type";
import type { CanvasExtension } from "../ZDragEditorCanvas/type";
export interface ZMenuItem {
  icon: string;
  text: string;
  name: string;
  component: any;
}
export type ZMenus = ZMenuItem[];
export interface ZDragEditorProps {
  components: ZDragNodes;
  menus?: ZMenus;
  canvasExtension?: CanvasExtension;
  splitter?: {
    leftHidden: boolean;
    rightHidden: boolean;
    leftMinWidth: number;
    rightMinWidth: number;
  };
  canvases: ZCanvasList;
  renderNode?: string;
}
