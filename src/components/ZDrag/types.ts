export interface Layout {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  zIndex: number;
  lock: boolean;
}
export interface MoveStart extends Omit<Layout, "zIndex" | "lock"> {
    layoutX: number;
    layoutY: number;
    centerX: number;
    centerY: number;
    radiusX: number;
    radiusY: number;
}
export interface ZDragProps {
  position: "absolute" | "fixed";
}
