import type { App, Plugin } from "vue";
import type { Layout } from "../components/ZDrag/types";
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
