import type { ZCanvas } from "@/common/type";
export interface CanvasItem extends ZCanvas {
  editor?: boolean;
}
export type CanvasList = CanvasItem[];
