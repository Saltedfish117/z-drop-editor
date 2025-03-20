import type { ZDragNode, ZDragNodes } from "@/common/type";

export interface ZDragEditorProps {
  nodes: ZDragNodes;
}
export type ZNodeMap = Map<string, ZDragNode>;
export interface ZDragEditorModel {
  nodes: ZDragNodes;
  canvas: {
    width: number;
    height: number;
    scale: number;
    drag: boolean;
    scroll: {
      top: number;
      left: number;
    };
  };
  moving: boolean;
  active: ZDragNode | undefined;
  components: ZDragNodes;
}

export interface ZCanvasContextMenuItem {
  label: string;
  action: (active: ZDragNode | undefined, closeMenu: () => void) => void;
  disabled: false;
  icon: string;
}
export interface ZLinesConfig {
  color: string;
  diff: number;
  interval: number;
}
export interface ZOption {
  lines?: Partial<ZLinesConfig>;
  canvasContextMenu?: {
    items: ZCanvasContextMenuItem[];
    clickClose: boolean;
  };
}
