import type { ZDragNodes, ZDragNode, ZCanvas, ZLayout } from "./type";
import { deepMerge } from "./utils";
export const createCanvas = (id: string, value: Partial<ZCanvas> = {}) => {
  const defaultValue = {
    id,
    layout: {
      width: window.innerWidth,
      height: window.innerHeight,
      scale: 0.8,
      x: 0,
      y: 0,
    },
    mode: "select",
    modeLock: false,
    nodes: [],
  };
  const canvasModel = deepMerge(value, defaultValue);
  return canvasModel;
};
export const createNode = (
  {
    id,
    component,
    label,
    canvasId,
    relative,
  }: {
    id: string;
    component: string;
    label: string;
    canvasId: string;
    relative: "pageId" | "canvasId";
  },
  value: Partial<{
    layout: Partial<ZLayout>;
    type: string;
    children?: ZDragNodes;
  }> = {}
) => {
  const defaultValue: ZDragNode = {
    id,
    component,
    label,
    canvasId,
    relative,
    layout: {
      width: 200,
      height: 200,
      x: 0,
      y: 0,
      rotate: 0,
      zIndex: 1,
      lock: false,
    },
    type: "component",
  };
  const node = deepMerge(value, defaultValue);
  return node;
};
