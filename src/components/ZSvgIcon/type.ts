import type { Size, Color } from "@/common/type";
export interface ZSvgIconProps {
  name: string;
  size?: number | keyof typeof Size;
  color?: string | keyof typeof Color;
}
