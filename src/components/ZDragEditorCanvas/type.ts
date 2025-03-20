import type { ZDragNode } from "@/common/type";
import type { ComponentPublicInstance } from "vue";
import type * as D3 from "d3";
export type ZNodeMap = Map<string, ZDragNode>;
export interface ZMode {
  name: string;
  mounted: (
    instance: ComponentPublicInstance,
    els: {
      wrapper: HTMLElement;
      canvas: HTMLElement;
    },
    d3: typeof D3
  ) => any;
  unmounted: (
    instance: ComponentPublicInstance,
    els: {
      wrapper: HTMLElement;
      canvas: HTMLElement;
    },
    d3: typeof D3,
    value: any
  ) => void;
}
/**
 *  modes: {
    [key: string]: {
      mounted: (
        instance: ComponentInternalInstance,
        els: {
          wrapper: HTMLElement;
          infiniteCanvas: HTMLElement;
        },
        d3: typeof D3
      ) => void;
      unmounted: (
        instance: ComponentInternalInstance,
        els: {
          wrapper: HTMLElement;
          infiniteCanvas: HTMLElement;
        },
        d3: typeof D3
      ) => void;
    };
  };
 */
export interface ZModeHandler {
  [key: string]: Omit<ZMode, "name">;
}
export type ZModeExtension = ZMode[];
