import type {
  ZDragNode,
  ZCanvas,
  WithRequiredProperty,
  CreateNode,
} from "./type";
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
    children: [],
    type: "canvas",
    label: "画布",
  };
  const canvasModel = deepMerge(value, defaultValue);
  return canvasModel;
};
export const createNode = (
  value: WithRequiredProperty<CreateNode, "label">
): ZDragNode => {
  const node = { ...value };
  const layout = deepMerge(value.layout ?? {}, {
    width: 200,
    height: 200,
    x: 0,
    y: 0,
    rotate: 0,
    zIndex: 1,
    lock: false,
  });
  node.layout = layout;
  return node as ZDragNode;
};
