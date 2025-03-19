import type { ZDragNode } from "@/common/type";
export interface ZCanvas {
  width: number;
  height: number;
  scale: number;
  drag: boolean;
  scroll: {
    top: number;
    left: number;
  };
  select: ZDragNode | undefined;
  moving: boolean;
  moveMode: string;
  mode: string;
  modes: {
    [key: string]: {
      install: (canvas: HTMLElement) => void;
      uninstall: (canvas: HTMLElement) => void;
    };
  };
}
