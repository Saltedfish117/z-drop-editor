import type { ZNode } from "../ZNode/types";

export type ZNodes = ZNode[];
export interface ZDragEditorProps {
  nodes: ZNodes;
}
export type ZNodeMap = Map<string, ZNode>;
export interface ZDragEditorModel {
  nodes: ZNodes;
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
  active: ZNode | undefined;
  components: ZNodes;
}
export interface ZOption {
  lines: Partial<{
    color: string;
    diff: number;
    interval: number;
  }>;
}
