import type { App, Plugin, Component, DefineComponent } from "vue";
import type { ZLayout, ZDragNode, ZMap, ZCanvas } from "@/common/type";
import { quadtree } from "d3";
export const getId = () => {
  return (
    "id-" +
    new Date().getTime().toString(36) +
    "-" +
    Math.random().toString(36).substring(2, 9)
  );
};
/**
 * 为组件添加 install 方法的类型扩展
 */
type SFCWithInstall<T> = T & Plugin;

/**
 * 组件自动注册插件
 * @param comp 需要全局注册的组件
 * @returns 带 install 方法的组件
 */
export function withInstall<T extends Component | DefineComponent>(
  comp: T,
  name: string
): SFCWithInstall<T> {
  (comp as SFCWithInstall<T>).install = (app: App) => {
    app.component(name, comp);
  };

  return comp as SFCWithInstall<T>;
}

export function sin(rotate: number) {
  return Math.abs(Math.sin(angleToRadian(rotate)));
}

export function cos(rotate: number) {
  return Math.abs(Math.cos(angleToRadian(rotate)));
}
function angleToRadian(angle: number) {
  return (angle * Math.PI) / 180;
}
export const rotateLayout = (_layout: ZLayout) => {
  const layout = { ..._layout };
  if (typeof layout.rotate === "number" && layout.rotate !== 0) {
    const { width, height, rotate } = layout;
    const newWidth = width * cos(rotate) + height * sin(rotate);
    const newX = Math.round((width - newWidth) / 2);
    layout.x += newX;
    layout.width = newWidth;
    const newHeight = height * cos(rotate) + width * sin(rotate);
    const newY = Math.round((newHeight - height) / 2);
    layout.y -= newY;
    layout.height = newHeight;
  }
  return layout;
};
export const calculateGroupLayout = (nodes: ZDragNode[]) => {
  const layouts = nodes.map((kid) => {
    return rotateLayout(kid.layout);
  });
  const x = Math.min(...layouts.map((item) => item.x));
  const y = Math.min(...layouts.map((item) => item.y));
  const width = Math.max(...layouts.map((item) => item.x + item.width)) - x;
  const height = Math.max(...layouts.map((item) => item.y + item.height)) - y;
  const z = Math.max(...layouts.map((item) => item.zIndex));
  return {
    x: x,
    y: y,
    width: width,
    height: height,
    zIndex: z,
  };
};
export const whetherToMoveInAndOut = (
  node: ZDragNode,
  treeMap: ZMap,
  canvas: ZCanvas
) => {
  if (node.type === "page") return;
  const parentId = node.parentId as string;
  if (!parentId) return;
  const parent = treeMap.get(parentId)!;
  if (parent.type === "group") return; // 如果是组，则不处理
  const { x, y, width, height } = node.layout;
  const relativeId = node![node!.relative] as string;
  const container = treeMap.get(relativeId)!;
  const mode = {
    pageId: () => {
      if (
        (x < 0 && Math.abs(x) >= width) ||
        (y < 0 && Math.abs(y) >= height) ||
        x > container.layout.width ||
        y > container.layout.height
      ) {
        node.relative = "canvasId";
        delete node.pageId;
        node.parentId = container.id;
        if (node.children && node.type === "group") {
          node.children.forEach((kid) => {
            kid.relative = "canvasId";
            delete kid.pageId;
          });
        }
        node.layout = {
          ...node.layout,
          x: x + container.layout.x,
          y: y + container.layout.y,
        };
        let pageChildren = container.children ?? [];
        pageChildren = pageChildren.filter((n) => n.id !== node.id);
        container.children = pageChildren;
        canvas.children?.push(node);
      }
    },
    canvasId: () => {
      const pages = canvas!.children!.filter((n) => n.type === "page");
      const tree = quadtree<ZDragNode>()
        .x((p) => p.layout.x)
        .y((p) => p.layout.y)
        .addAll(pages);
      const page = tree.find(x, y);
      if (!page) return;
      if (
        x > page.layout.x &&
        x + width < page.layout.x + page.layout.width &&
        y > page.layout.y &&
        y + height < page.layout.y + page.layout.height
      ) {
        node.pageId = page.id;
        node.parentId = page.id;
        node.relative = "pageId";
        if (node.children && node.type === "group") {
          node.children.forEach((kid) => {
            kid.pageId = page.id;
            kid.relative = "pageId";
          });
        }
        let canvasChildren = canvas.children ?? [];
        canvasChildren = canvasChildren.filter((n) => n.id !== node.id);
        canvas.children = canvasChildren;
        node.layout = {
          ...node.layout,
          x: x - page.layout.x,
          y: y - page.layout.y,
        };
        const newChildren = page.children ?? [];
        newChildren!.push(node);
        page.children = newChildren;
      }
    },
  };
  mode[node!.relative as keyof typeof mode]();
};
export const calculateMousedownPosition = (
  axis: {
    clientX: number;
    clientY: number;
  },
  dom: HTMLElement,
  scale: number
) => {
  const scaleFactor = 1 / scale;
  const rect = dom.getBoundingClientRect();
  return {
    x: Math.round((axis.clientX - rect.left) * scaleFactor),
    y: Math.round((axis.clientY - rect.top) * scaleFactor),
  };
};
/**
 * 计算绕指定中心点旋转后的坐标
 *
 * 根据二维旋转公式，将输入坐标绕给定中心点旋转指定角度后，返回新的整数坐标
 *
 * @param realTimeCoordinates - 需要旋转的原始坐标对象，包含x/y分量（单位应与中心点一致）
 * @param centerCoordinate - 旋转中心坐标对象，包含x/y分量
 * @param _rotate - 旋转角度值（角度制，顺时针方向为正方向）
 * @returns 返回旋转后的坐标对象，x/y分量已进行四舍五入取整
 *
 * @remarks
 * 实现原理：
 * 1. 将角度转换为弧度并取反，用于处理坐标系差异（将常见的顺时针旋转转为数学的正方向计算）
 * 2. 应用二维旋转矩阵公式计算新坐标
 * 3. 对结果坐标进行四舍五入处理
 */
export const calculateRotateCoordinate = (
  realTimeCoordinates: { x: number; y: number },
  centerCoordinate: {
    x: number;
    y: number;
  },
  _rotate: number
) => {
  /** 转换角度为弧度并取反，适配数学坐标系计算 */
  const rotate = angleToRadian(-_rotate); // 角度制转弧度制并取反
  // 应用旋转矩阵公式计算新坐标，并四舍五入到最近整数
  return {
    x: Math.round(
      (realTimeCoordinates.x - centerCoordinate.x) * Math.cos(rotate) -
        (realTimeCoordinates.y - centerCoordinate.y) * Math.sin(rotate) +
        centerCoordinate.x
    ),
    y: Math.round(
      (realTimeCoordinates.x - centerCoordinate.x) * Math.sin(rotate) +
        (realTimeCoordinates.y - centerCoordinate.y) * Math.cos(rotate) +
        centerCoordinate.y
    ),
  };
};
// 求两点之间的中点坐标
export const getCenterCoordinate = (
  realTimeCoordinates: { x: number; y: number },
  symmetric: {
    x: number;
    y: number;
  }
) => ({
  x: (realTimeCoordinates.x + symmetric.x) / 2,
  y: (realTimeCoordinates.y + symmetric.y) / 2,
});
/**
 * 防抖函数
 * @param func 目标函数
 * @param delay 延迟时间(ms)
 * @returns 包装后的防抖函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};
/**
 * 节流函数（时间戳版）
 * @param func 目标函数
 * @param limit 时间限制(ms)
 * @returns 包装后的节流函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let lastTime = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastTime >= limit) {
      func(...args);
      lastTime = now;
    }
  };
};
export const once = <T extends (...args: any[]) => any>(
  func: T
): ((...args: Parameters<T>) => void) => {
  let flag = false;
  return (...args: Parameters<T>) => {
    if (!flag) {
      flag = true;
      func(...args);
    }
  };
};
const isObject = (value: any) => {
  return Object.prototype.toString.call(value) === "[object Object]";
};
/**
 * 深层合并对象
 * @param target 目标对象
 * @param source 默认值对象
 * @returns 合并后的新对象
 */
export function deepMerge<T extends Record<string, any>>(
  target: Partial<T>,
  source: T
): T {
  const result = { ...target }; // 创建目标对象的浅拷贝
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (result[key] === undefined) {
        result[key] = source[key];
      } else if (isObject(result[key])) {
        result[key] = deepMerge(result[key], source[key]);
      }
    }
  }
  return result as T;
}
/**
 * 深度克隆一个对象，支持处理多种数据类型，包括基本类型、Date、RegExp、Map、Set、数组和普通对象。
 * 使用 WeakMap 来缓存已克隆的对象，避免循环引用导致的无限递归。
 *
 * @param obj - 需要克隆的对象，可以是任意类型。
 * @param hash - 用于缓存已克隆对象的 WeakMap，避免循环引用。默认为一个新的 WeakMap。
 * @returns 返回克隆后的对象，类型与输入对象相同。
 */
export function deepClone(obj: any, hash = new WeakMap()) {
  // 如果 obj 是基本类型或 null，直接返回
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // 处理 Date 类型，返回一个新的 Date 对象
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // 处理 RegExp 类型，返回一个新的 RegExp 对象
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // 处理 Map 类型，递归克隆 Map 的键和值
  if (obj instanceof Map) {
    const mapCopy = new Map();
    hash.set(obj, mapCopy);
    obj.forEach((value, key) => {
      mapCopy.set(deepClone(key, hash), deepClone(value, hash));
    });
    return mapCopy;
  }

  // 处理 Set 类型，递归克隆 Set 的值
  if (obj instanceof Set) {
    const setCopy = new Set();
    hash.set(obj, setCopy);
    obj.forEach((value) => {
      setCopy.add(deepClone(value, hash));
    });
    return setCopy;
  }

  // 处理数组类型，递归克隆数组的每个元素
  if (Array.isArray(obj)) {
    const arrCopy: any[] = [];
    hash.set(obj, arrCopy);
    for (let i = 0; i < obj.length; i++) {
      arrCopy[i] = deepClone(obj[i], hash);
    }
    return arrCopy;
  }

  // 如果对象已经被克隆过，直接返回缓存中的克隆对象
  if (hash.has(obj)) {
    return hash.get(obj);
  }

  // 创建一个与原对象相同原型的新对象
  const objCopy = Object.create(Object.getPrototypeOf(obj));
  hash.set(obj, objCopy);

  // 递归克隆对象的普通属性和 Symbol 属性
  Reflect.ownKeys(obj).forEach((key) => {
    if (obj.hasOwnProperty(key)) {
      objCopy[key] = deepClone(obj[key], hash);
    }
  });

  return objCopy;
}
export const serializer = {
  deserialize: <T>(str: string): T => {
    let data = JSON.parse(str, (_, value) => {
      if (typeof value === "string" && value.includes("-FUNCTION")) {
        return new Function("return " + value.replace("-FUNCTION", ""))();
      } else {
        return value;
      }
    });
    return data;
  },
  serialize: <T>(data: T): string => {
    const stateStr = JSON.stringify(data, (_, value) => {
      if (typeof value === "function") {
        return value + "-FUNCTION";
      } else {
        return value;
      }
    });
    return stateStr;
  },
};
