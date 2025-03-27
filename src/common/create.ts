import type {
  ZDragNode,
  ZCanvas,
  WithRequiredProperty,
  CreateNode,
} from "./type";
import { deepMerge, calculateGroupLayout } from "./utils";
// 导出一个名为 createCanvas 的函数，用于创建画布对象
export const createCanvas = (id: string, value: Partial<ZCanvas> = {}) => {
  // 定义默认的画布属性
  const defaultValue = {
    // 画布的唯一标识符
    id,
    // 画布的布局属性
    layout: {
      // 画布的宽度，默认为窗口的宽度
      width: window.innerWidth,
      // 画布的高度，默认为窗口的高度
      height: window.innerHeight,
      // 画布的缩放比例，默认为0.8
      scale: 0.8,
      // 画布在X轴上的偏移量，默认为0
      x: 0,
      // 画布在Y轴上的偏移量，默认为0
      y: 0,
    },
    // 画布的模式，默认为 "select"（选择模式）
    mode: "select",
    // 模式锁定状态，默认为 false（未锁定）
    modeLock: false,
    // 画布的子元素列表，默认为空数组
    children: [],
    // 画布的类型，默认为 "canvas"
    type: "canvas",
    // 画布的标签，默认为 "画布"
    label: "画布",
  };
  // 使用 deepMerge 函数将用户提供的属性与默认属性进行深度合并
  const canvasModel = deepMerge(value, defaultValue);
  // 返回合并后的画布对象
  return canvasModel;
};

// 导出一个名为 createNode 的函数，该函数接收一个参数 value，该参数必须包含一个名为 "label" 的属性
export const createNode = (
  value: WithRequiredProperty<CreateNode, "label">
): ZDragNode => {
  // 创建一个新的对象 node，并将 value 的所有属性复制到 node 中
  const node = { ...value };
  // 使用 deepMerge 函数合并 value.layout 和一个默认的布局对象
  // 如果 value.layout 不存在，则使用默认布局对象
  const layout = deepMerge(value.layout ?? {}, {
    width: 200,    // 节点的宽度，默认值为 200
    height: 200,   // 节点的高度，默认值为 200
    x: 0,          // 节点的横坐标，默认值为 0
    y: 0,          // 节点的纵坐标，默认值为 0
    rotate: 0,     // 节点的旋转角度，默认值为 0
    zIndex: 1,     // 节点的 z-index，默认值为 1
    lock: false,   // 节点是否锁定，默认值为 false
  });
  // 将合并后的布局对象赋值给 node.layout
  node.layout = layout;
  // 将 node 对象强制转换为 ZDragNode 类型并返回
  return node as ZDragNode;
};
// 导出一个名为 createGroup 的常量，它是一个函数
export const createGroup = (
  // 函数接受一个参数 value，该参数的类型是 CreateNode 类型，并且必须包含 "label" 和 "children" 属性
  value: WithRequiredProperty<CreateNode, "label" | "children">
): ZDragNode => {
  // 创建一个新的节点对象 node，复制 value 的所有属性，并添加 hasRotate 属性，初始值为 false
  const node = { ...value, hasRotate: false };
  // 创建一个新的布局对象 layout，通过 deepMerge 函数合并 value.layout 和一个默认布局对象
  // 默认布局对象包含 rotate: 0, lock: false 和通过 calculateGroupLayout 函数计算出的子节点布局
  const layout = deepMerge(value.layout ?? {}, {
    rotate: 0,
    lock: false,
    ...calculateGroupLayout(value.children),
  });
  // 将计算好的布局对象 layout 赋值给 node 的 layout 属性
  node.layout = layout;
  // 将 node 对象强制转换为 ZDragNode 类型并返回
  return node as ZDragNode;
};
