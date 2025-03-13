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
  };
  moving: boolean;
  active: ZNode | undefined;
  components: ZNodes;
}
export interface ZOption {
  lines: {
    show: boolean;
    color: string;
    width: number;
    diff: number;
    interval: number;
  };
}
