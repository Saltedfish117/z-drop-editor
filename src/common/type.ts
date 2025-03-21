import type { CSSProperties } from "vue";
export type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property];
};
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
export interface ZDragNodeBase {
  id: string;
  label?: string;
  type: string;
  component: string;
  children?: ZDragNode[];
  parentId?: string;
  rotate?: boolean;
}
export interface ZDragNodeRelative {
  pageId?: string;
  canvasId?: string;
  relative: "pageId" | "canvasId" | "parentId";
}
export interface ZDragNode extends ZDragNodeBase, ZDragNodeRelative {
  layout: ZLayout;
}
export interface CreateNode extends ZDragNodeBase, ZDragNodeRelative {
  layout?: Partial<ZLayout>;
}
export type ZDragNodes = ZDragNode[];
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
  children: ZDragNodes;
  id: string;
  readonly type: string;
  label?: string;
}
export type ZCanvasList = ZCanvas[];
export type ZMap = Map<string, ZDragNode | ZCanvas>;
