import type { ZLayout } from "../ZDrag/types";
export interface ZLinesProps {}
// export enum {
//     : string;
// }
export type lineType =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "left-top"
  | "left-bottom"
  | "right-top"
  | "right-bottom";
export interface ZAdsorption {
  x: string;
  y: string;
  width: string;
  height: string;
  label: {
    text: string;
    style: {
      left?: string;
      right?: string;
      bottom?: string;
      top?: string;
    };
  };
  key: lineType;
  // visible: boolean;
  // type: string;
  // nodeId: string;
}
export type LineMap = {
  [key in lineType]: (rect: ZLayout) => ZAdsorption;
};
export type ZAdsorptions = ZAdsorption[];
