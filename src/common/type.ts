import type { CSSProperties } from "vue";
export enum Size {
  xs = 12,
  sm = 16,
  md = 24,
  lg = 32,
  xl = 48,
}
export enum Color {
  primary = "#409EFF",
  success = "#67C23A",
  warning = "#E6A23C",
  danger = "#F56C6C",
  info = "#909399",
}
export interface ZAxis {
  x: number;
  y: number;
}
export interface ZLayout extends ZAxis {
  width: number;
  height: number;
  rotate: number;
  zIndex: number;
  lock: boolean;
}
export interface ZDragNode {
  id: string;
  label?: string;
  type: string;
  component: string;
  children?: ZDragNode[];
  parentId?: string;
  rotate?: boolean;
  pageId?: string;
  canvasId?: string;
  relative: "pageId" | "canvasId";
  layout: ZLayout;
}
export interface ZCanvas {
  layout: {
    x: number;
    y: number;
    width: number;
    height: number;
    scale: number;
    pointerEvents?: CSSProperties["pointerEvents"];
    cursor?: CSSProperties["cursor"];
  };
  mode: string;
  modeLock: boolean;
  nodes: ZDragNodes;
}
export type ZCanvasList = ZCanvas[];
export type ZDragNodes = ZDragNode[];
