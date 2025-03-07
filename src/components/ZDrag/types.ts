import type { CSSProperties } from "vue";
export interface Layout {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  zIndex: number;
  lock: boolean;
}
export interface DragNode {
  id: string;
  layout: Layout;
}
export interface Offset {
  x: number;
  y: number;
}
export interface MoveStart extends Omit<Layout, "zIndex" | "lock"> {
  layoutX: number;
  layoutY: number;
  centerX: number;
  centerY: number;
  symmetricX: number;
  symmetricY: number;
}
export interface ZDragProps {
  position: "absolute" | "fixed";
  scale: number;
}
export type Direction =
  | "n-resize"
  | "e-resize"
  | "w-resize"
  | "s-resize"
  | "ne-resize"
  | "se-resize"
  | "sw-resize"
  | "nw-resize"
  | "move"
  | "rotate";
export interface Point {
  direction: Direction;
  style: CSSProperties;
}
export type Points = Point[];
export type AngleToCursor = {
  start: number;
  end: number;
  cursor: Direction;
}[];
export type ResizeFunction = {
  (offset: Offset, _layout: Layout, start: MoveStart): Layout;
  (offset: Offset, _layout: Layout, start: MoveStart, e?: MouseEvent): Layout;
};
export type ResizeMove = Record<Direction, ResizeFunction>;
