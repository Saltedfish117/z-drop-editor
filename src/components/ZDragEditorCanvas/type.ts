import type { ZDragNode } from "@/common/type";
import type { ComponentPublicInstance, CSSProperties, ModelRef } from "vue";
import type * as D3 from "d3";
export type ZNodeMap = Map<string, ZDragNode>;
export interface ZMode {
  name: string;
  mounted: (
    instance: ComponentPublicInstance<ZDragEditorCanvasProps, {}, {}>,
    els: {
      wrapper: HTMLElement;
      canvas: HTMLElement;
    },
    d3: typeof D3
  ) => any;
  unmounted: (
    instance: ComponentPublicInstance<ZDragEditorCanvasProps, {}, {}>,
    els: {
      wrapper: HTMLElement;
      canvas: HTMLElement;
    },
    d3: typeof D3,
    value: any
  ) => void;
}
export interface ZModeHandler {
  [key: string]: Omit<ZMode, "name">;
}
export interface ZCanvas {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  pointerEvents?: CSSProperties["pointerEvents"];
  cursor?: CSSProperties["cursor"];
}

export type ZModeExtension = ZMode[];
export interface keyMode {
  key: string;
  handler: (model: ModelRef<string, string, string, string>) => void;
}

export type KeyModeExtension = keyMode[];
export interface CanvasExtension {
  modeExtension?: ZModeExtension;
  keydownModeExtension?: KeyModeExtension;
  keyupModeExtension?: KeyModeExtension;
}
export interface ZDragEditorCanvasProps extends CanvasExtension {
  modelValue: ZCanvas;
  modeLock?: boolean;
  mode?: string;
}
