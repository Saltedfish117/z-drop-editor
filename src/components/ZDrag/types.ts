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
