import type { Component } from "vue";
import type { DragNode } from "../ZDrag/types";
export interface ZNode extends DragNode {
  component: string | Component;
  children?: ZNode[];
}
export interface ZNodeProps {
  node: ZNode;
}
