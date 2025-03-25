export interface ZTreeNode {
    id: string;
    label: string;
    children?: ZTreeNode[];
    isExpanded?: boolean;
    isSelected?: boolean;
  }