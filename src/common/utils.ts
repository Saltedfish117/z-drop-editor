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
// export const rotateLayout = (_layout: Layout) => {
//   // 直接返回原始布局参数
//   return { ..._layout };
// };

// export const getRotatedCorners = (layout: Layout) => {
//   const { x, y, width, height, rotate = 0 } = layout;
//   const rad = (rotate * Math.PI) / 180;

//   // 计算四个角原始坐标（相对于元素中心）
//   const corners = [
//     { x: -width / 2, y: -height / 2 }, // 左上
//     { x: width / 2, y: -height / 2 }, // 右上
//     { x: width / 2, y: height / 2 }, // 右下
//     { x: -width / 2, y: height / 2 }, // 左下
//   ];

//   // 应用旋转矩阵并转换为绝对坐标
//   return corners.map((p) => {
//     const rotatedX = p.x * Math.cos(rad) - p.y * Math.sin(rad);
//     const rotatedY = p.x * Math.sin(rad) + p.y * Math.cos(rad);
//     return {
//       x: x + rotatedX + width / 2,
//       y: y + rotatedY + height / 2,
//     };
//   });
// };
export const getRotatedCorners = (layout: Layout) => {
  const { x, y, width, height, rotate = 0 } = layout;
  const rad = (rotate * Math.PI) / 180;

  // 计算四个角原始坐标
  const corners = [
    { x: 0, y: 0 }, // 左上
    { x: width, y: 0 }, // 右上
    { x: width, y: height }, // 右下
    { x: 0, y: height }, // 左下
  ];

  // 应用旋转矩阵
  return corners.map((p) => {
    const rotatedX = p.x * Math.cos(rad) - p.y * Math.sin(rad) + x;
    const rotatedY = p.x * Math.sin(rad) + p.y * Math.cos(rad) + y;
    return { x: rotatedX, y: rotatedY };
  });
};
export function sin(rotate:number) {
  return Math.abs(Math.sin(angleToRadian(rotate)))
}

export function cos(rotate:number) {
  return Math.abs(Math.cos(angleToRadian(rotate)))
}
function angleToRadian(angle:number) {
  return (angle * Math.PI) / 180
}
export const rotateLayout = (_layout: Layout) => {
  const layout = { ..._layout };
  const { rotate } = layout;

  if (typeof rotate === "number" && rotate !== 0) {
    const newW = 
  }

  return layout;
};
// 计算元素旋转后的实际包围盒
export const getRotatedBoundingBox = (layout: Layout) => {
  const corners = getRotatedCorners(layout);
  const xs = corners.map((p) => p.x);
  const ys = corners.map((p) => p.y);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
    centerX: (Math.min(...xs) + Math.max(...xs)) / 2,
    centerY: (Math.min(...ys) + Math.max(...ys)) / 2,
  };
};
// 自动吸附检测函数
export const checkAdsorption = (
  current: Layout,
  targets: Layout[],
  threshold: number = 5
) => {
  const currentBox = getRotatedBoundingBox(current);
  const adsorptions = [];

  for (const target of targets) {
    const targetBox = getRotatedBoundingBox(target);

    // 水平方向吸附检测
    if (Math.abs(currentBox.minX - targetBox.minX) < threshold) {
      adsorptions.push({ axis: "x", value: targetBox.minX, type: "min-min" });
    }
    if (Math.abs(currentBox.minX - targetBox.maxX) < threshold) {
      adsorptions.push({ axis: "x", value: targetBox.maxX, type: "min-max" });
    }
    // 垂直方向吸附检测同理

    // 中心点对齐检测
    if (Math.abs(currentBox.centerX - targetBox.centerX) < threshold) {
      adsorptions.push({ axis: "x", value: targetBox.centerX, type: "center" });
    }
    if (Math.abs(currentBox.centerY - targetBox.centerY) < threshold) {
      adsorptions.push({ axis: "y", value: targetBox.centerY, type: "center" });
    }
  }

  return adsorptions;
};
// export const rotateLayout = (_layout: Layout) => {
//   const layout = { ..._layout };
//   if (typeof layout.rotate === "number" && layout.rotate !== 0) {
//     const { width, height, rotate, x, y } = layout;
//     const newWidth =
//       width * Math.cos((rotate * Math.PI) / 180) +
//       height * Math.sin((rotate * Math.PI) / 180);
//     const newX = Math.round(x + (width - newWidth) / 2);
//     layout.x = newX;
//     layout.width = newWidth;
//     const newHeight =
//       height * Math.cos((rotate * Math.PI) / 180) +
//       width * Math.sin((rotate * Math.PI) / 180);
//     const newY = Math.round(y + (height - newHeight) / 2);
//     layout.y = newY;
//     layout.height = newHeight;
//   }
//   return layout;
// };
