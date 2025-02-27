import type { ZNode } from "../ZNode/types";

export type ZNodes = ZNode[];
export interface ZDragEditorProps {
  nodes: ZNodes;
}
export interface ZDragEditorModel {
  nodes: ZNodes;
  active: ZNode | null;
  components: ZNodes;
}
