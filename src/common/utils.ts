import type { App, Plugin } from "vue";
import type { Layout } from "../components/ZDrag/types";
import type { ZNode as Node } from "../components/ZNode/types";
/**
 * 为组件添加 install 方法的类型扩展
 */
type SFCWithInstall<T> = T & Plugin;

/**
 * 组件自动注册插件
 * @param comp 需要全局注册的组件
 * @returns 带 install 方法的组件
 */
export function withInstall<T extends { name: string }>(
  comp: T
): SFCWithInstall<T> {
  (comp as SFCWithInstall<T>).install = (app: App) => {
    app.component(comp.name, comp);
  };

  return comp as SFCWithInstall<T>;
}

/**
 * 多个组件批量注册的版本
 * @param components 组件数组
 * @returns 包含 install 方法的插件对象
 */
export function withInstallAll(components: { name: string }[]): Plugin {
  return {
    install(app: App) {
      components.forEach((comp) => {
        app.component(comp.name, comp);
      });
    },
  };
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
export const rotateLayout = (_layout: Layout) => {
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
export const calculateGroupLayout = (nodes: Node[]) => {
  const layouts = nodes.map((kid) => {
    return rotateLayout(kid.layout);
  });
  const xs = layouts.map((kid) => kid.x);
  const ys = layouts.map((kid) => kid.y);
  const is = layouts.map((kid) => kid.zIndex);
  const mw = layouts.reduce((prev, curr) => {
    return prev.x + prev.width > curr.x + curr.width ? prev : curr;
  });
  const mh = layouts.reduce((prev, curr) => {
    return prev.y + prev.height > curr.y + curr.height ? prev : curr;
  });
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  const w = mw.x + mw.width - x;
  const h = mh.y + mh.height - y;
  const z = Math.max(...is);
  return {
    x: x,
    y: y,
    width: w,
    height: h,
    zIndex: z,
  };
};
export const calculateMousePosition = (
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
