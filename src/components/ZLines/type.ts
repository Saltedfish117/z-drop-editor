export interface ZLinesProps {}
// export enum {
//     : string;
// }
export interface ZAdsorption {
  x: number;
  y: number;
  width: string;
  height: string;
  label: {
    text: string;
    style: {
      position: string;
      left?: string;
      right?: string;
      bottom?: string;
      top?: string;
    };
  };
  key: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  visible: boolean;
  type: string;
  nodeId: string;
}
export type ZAdsorptions = ZAdsorption[];
