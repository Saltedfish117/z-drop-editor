<script setup lang="ts">
import { ref, computed, watch } from "vue";
// import type {  } from "@/common/type";
import type { ZDragNode, ZMap, ZLayout, ZCanvas } from "@/common/type";
import type { CSSProperties } from "vue";

const props = defineProps<{
  modelValue: ZLayout;
  treeMap: ZMap;
  selectCanvas: ZCanvas;
  selectNode: ZDragNode;
  wrapper: HTMLElement;
}>();

// 吸附距离阈值（像素）
const SNAP_THRESHOLD = 5;

// 存储所有参考线
const referenceLines = ref<{
  vertical: Array<{ position: number; start: number; end: number }>;
  horizontal: Array<{ position: number; start: number; end: number }>;
}>({
  vertical: [],
  horizontal: [],
});

// 计算当前选中元素的边界
const selectedBounds = computed(() => {
  const { x, y, width, height } = props.modelValue;
  return {
    left: x,
    right: x + width,
    top: y,
    bottom: y + height,
    centerX: x + width / 2,
    centerY: y + height / 2,
  };
});

// 计算其他元素的边界
const otherElementsBounds = computed(() => {
  const bounds: Array<{
    id: string;
    left: number;
    right: number;
    top: number;
    bottom: number;
    centerX: number;
    centerY: number;
  }> = [];
  const select = props.treeMap.get(props.selectNode.id) as ZDragNode;
  if (!select) return [];
  let container: ZCanvas | ZDragNode | null;
  if (select.relative === "canvasId") {
    container = props.treeMap.get(select.canvasId as string) as ZCanvas;
  } else {
    container = props.treeMap.get(select.pageId as string) as ZDragNode;
  }
  if (!container || !container.children) return [];
  container.children.forEach((node) => {
    if (node.id === props.selectNode.id) return;
    if (node.type === "canvas") return;
    const { x, y, width, height } = node.layout;
    if (node.relative === "canvasId") {
      bounds.push({
        id: node.id,
        left: x,
        right: x + width,
        top: y,
        bottom: y + height,
        centerX: x + width / 2,
        centerY: y + height / 2,
      });
    } else {
      const parentLayout = container.layout;
      bounds.push({
        id: node.id,
        left: x + parentLayout.x,
        right: x + width + parentLayout.x,
        top: y + parentLayout.y,
        bottom: y + height + parentLayout.y,
        centerX: x + width / 2 + parentLayout.x,
        centerY: y + height / 2 + parentLayout.y,
      });
    }
  });

  return bounds;
});

// 计算参考线
const calculateReferenceLines = () => {
  const selected = selectedBounds.value;
  const others = otherElementsBounds.value;
  const lines = {
    vertical: [] as Array<{ position: number; start: number; end: number }>,
    horizontal: [] as Array<{ position: number; start: number; end: number }>,
  };

  others.forEach((other) => {
    // 垂直对齐（左、中、右）
    if (Math.abs(selected.left - other.left) < SNAP_THRESHOLD) {
      lines.vertical.push({
        position: other.left,
        start: Math.min(selected.top, other.top),
        end: Math.max(selected.bottom, other.bottom),
      });
    }
    if (Math.abs(selected.centerX - other.centerX) < SNAP_THRESHOLD) {
      lines.vertical.push({
        position: other.centerX,
        start: Math.min(selected.top, other.top),
        end: Math.max(selected.bottom, other.bottom),
      });
    }
    if (Math.abs(selected.right - other.right) < SNAP_THRESHOLD) {
      lines.vertical.push({
        position: other.right,
        start: Math.min(selected.top, other.top),
        end: Math.max(selected.bottom, other.bottom),
      });
    }

    // 水平对齐（上、中、下）
    if (Math.abs(selected.top - other.top) < SNAP_THRESHOLD) {
      lines.horizontal.push({
        position: other.top,
        start: Math.min(selected.left, other.left),
        end: Math.max(selected.right, other.right),
      });
    }
    if (Math.abs(selected.centerY - other.centerY) < SNAP_THRESHOLD) {
      lines.horizontal.push({
        position: other.centerY,
        start: Math.min(selected.left, other.left),
        end: Math.max(selected.right, other.right),
      });
    }
    if (Math.abs(selected.bottom - other.bottom) < SNAP_THRESHOLD) {
      lines.horizontal.push({
        position: other.bottom,
        start: Math.min(selected.left, other.left),
        end: Math.max(selected.right, other.right),
      });
    }
  });

  referenceLines.value = lines;
};

// 监听选中元素位置变化
watch(
  () => props.modelValue,
  () => {
    calculateReferenceLines();
  },
  { deep: true }
);

// 计算参考线样式
const referenceLineStyle = computed(
  (): CSSProperties => {
    return {
      position: "absolute",
      pointerEvents: "none",
      zIndex: 9999,
      left: "0",
      top: "0",
    };
  }
);

// 计算垂直参考线样式
const verticalLineStyle = (line: {
  position: number;
  start: number;
  end: number;
}): CSSProperties => ({
  position: "absolute",
  left: `${line.position}px`,
  top: `${line.start}px`,
  width: "2px",
  height: `${line.end - line.start}px`,
  backgroundColor: "rgb(var(--z-primary))",
  opacity: 1,
});

// 计算水平参考线样式
const horizontalLineStyle = (line: {
  position: number;
  start: number;
  end: number;
}): CSSProperties => ({
  position: "absolute",
  left: `${line.start}px`,
  top: `${line.position}px`,
  width: `${line.end - line.start}px`,
  height: "2px",
  backgroundColor: "rgb(var(--z-primary))",
  opacity: 1,
});
</script>

<template>
  <div :style="referenceLineStyle">
    <!-- 垂直参考线 -->
    <div
      v-for="(line, index) in referenceLines.vertical"
      :key="`v-${index}`"
      :style="verticalLineStyle(line)"
    ></div>
    <!-- 水平参考线 -->
    <div
      v-for="(line, index) in referenceLines.horizontal"
      :key="`h-${index}`"
      :style="horizontalLineStyle(line)"
    ></div>
  </div>
</template>

<style scoped>
.reference-line {
  position: absolute;
  pointer-events: none;
  z-index: 9999;
}
</style>
