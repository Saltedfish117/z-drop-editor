import type { Component } from "vue";
import type { DragNode } from "../ZDrag/types";
export interface ZNode extends DragNode {
  id: string;
  label?: string;
  type: string;
  component: string | Component;
  children?: ZNode[];
  parentId?: string;
  rotate?: boolean;
  relativeCanvas: "canvas" | string;
}
// export interface ZNodeProps {
//   node: ZNode;
//   parent: HTMLElement;
// }
