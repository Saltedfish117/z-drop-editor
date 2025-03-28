import type {
  ZDragNodes,
  ZDragNode,
  ZMap,
  //   ZLayout,
  ZCanvas,
  ZDragMap,
} from "@/common/type";
export interface ZAreaProps {
  wrapper: HTMLElement | null;
  canvas: HTMLElement | null;
  scale: number;
  nodes: ZDragNodes;
  treeMap: ZMap;
  selectCanvas: ZCanvas;
  selectNode?: ZDragNode;
  dragMap: ZDragMap;
}
