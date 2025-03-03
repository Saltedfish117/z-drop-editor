import type { Layout } from "../components/ZDrag/types";
export const rotateLayout = (_layout: Layout) => {
  const layout = { ..._layout };
  if (typeof layout.rotate === "number" && layout.rotate !== 0) {
    const { width, height, rotate, x, y } = layout;
    const newWidth =
      width * Math.cos((rotate * Math.PI) / 180) +
      height * Math.sin((rotate * Math.PI) / 180);
    const newX = Math.round(x + (width - newWidth) / 2);
    layout.x = newX;
    layout.width = newWidth;
    const newHeight =
      height * Math.cos((rotate * Math.PI) / 180) +
      width * Math.sin((rotate * Math.PI) / 180);
    const newY = Math.round(y + (height - newHeight) / 2);
    layout.y = newY;
    layout.height = newHeight;
  }
  return layout;
};
