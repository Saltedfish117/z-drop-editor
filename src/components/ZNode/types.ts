import type { Component } from "vue";
import type { DragNode } from "../ZDrag/types";
export interface ZNode extends DragNode {
  id: string;
  component: string | Component;
  children?: ZNode[];
  parentId?: string;
}
export interface ZNodeProps {
  node: ZNode;
  parent: HTMLElement;
}
