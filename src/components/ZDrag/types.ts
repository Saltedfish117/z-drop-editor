import type { CSSProperties } from "vue";
export interface Axis {
  x: number;
  y: number;
}
export interface Layout extends Axis {
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
  beforeAngle: number;
  center: Axis;
  symmetric: Axis;
  point: Axis;
}
export interface ZDragProps {
  position: "absolute" | "fixed";
  scale: number;
  canvasSize: {
    width: number;
    height: number;
  };
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
