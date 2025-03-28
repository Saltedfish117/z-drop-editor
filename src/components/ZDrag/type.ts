import type { CSSProperties } from "vue";
import type { ZAxis, ZLayout } from "@/common/type";
export type Offset = ZAxis;
export interface MoveStart extends Omit<ZLayout, "zIndex" | "lock"> {
  layout: ZAxis;
  beforeAngle: number;
  center: ZAxis;
  symmetric: ZAxis;
  point: ZAxis;
}
export interface ZDragProps {
  position?: "absolute" | "fixed";
  scale: number;
  active: boolean;
  rotate?: boolean;
  container: HTMLElement;
  hasLock?: boolean;
  hasRotate?: boolean;
  lockRatio?: boolean;
}
export type Direction =
  | "n-resize"
  | "e-resize"
  | "w-resize"
  | "s-resize"
  | "ne-resize"
  | "se-resize"
  | "sw-resize"
  | "nw-resize";
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
export type Moves = "move" | "rotate";
export interface Option {
  layout: ZLayout;
  start: MoveStart;
  realTimeCoordinates: ZAxis;
}
export type Resize = {
  [key in Direction]: (option: Option) => ZLayout;
};
