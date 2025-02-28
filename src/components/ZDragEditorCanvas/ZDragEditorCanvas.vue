<template>
  <div ref="canvasWrapper" @scroll="handleScrollbar" class="canvas-wrapper">
    <article
      tabindex="-1"
      @keydown.space="spaceDown"
      @keyup.space="spaceUp"
      class="infinite-canvas"
      :style="{
        width: size.width + 'px',
        height: size.height + 'px',
        transform: `scale(${scale})`,
      }"
    >
      <slot :isDragging="isDragging" :canvasSize="size" name="default"></slot>
    </article>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  onMounted,
  onUnmounted,
  defineOptions,
  defineModel,
} from "vue";

defineOptions({
  name: "ZDragEditorCanvas",
  directives: {},
});
const props = defineProps({
  size: {
    type: Object,
    required: true,
    default: () => {
      return {
        width: 5000,
        height: 5000,
      };
    },
  },
  scale: {
    type: Number,
    required: true,
    default: 1,
  },
});
// 画布容器引用
const canvasWrapper = ref<HTMLElement | null>(null);
// 初始尺寸
const size = defineModel("size", {
  type: Object,
  required: true,
  default: () => {
    return {
      width: 5000,
      height: 5000,
    };
  },
});

const isDragging = ref(false); // 画布状态
const startPos = reactive({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
// 拖拽处理
const handleMouseDown = (e: MouseEvent) => {
  if (!canvasWrapper.value) return;
  // 判断是否按下空格键
  isDragging.value = true;
  startPos.x = e.clientX;
  startPos.y = e.clientY;
  startPos.scrollLeft = canvasWrapper.value.scrollLeft;
  startPos.scrollTop = canvasWrapper.value.scrollTop;
  document.documentElement.style.cursor = "grabbing";
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};
const handleMouseMove = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  document.documentElement.style.cursor = "grabbing";
  const scaleFactor = 1 / props.scale; // 计算缩放修正因子
  // 根据缩放倍率修正偏移量
  let offsetX = (e.clientX - startPos.x) * scaleFactor;
  let offsetY = (e.clientY - startPos.y) * scaleFactor;
  let resultX = startPos.scrollLeft - offsetX;
  let resultY = startPos.scrollTop - offsetY;
  canvasWrapper.value?.scrollTo(resultX, resultY);
  checkBoundary();
};
const handleMouseUp = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  isDragging.value = false;
  document.documentElement.style.cursor = "grab";
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
  document.documentElement.style.userSelect = "none";
};
const spaceDown = (e: KeyboardEvent) => {
  e.preventDefault();
  e.stopPropagation();
  document.addEventListener("mousedown", handleMouseDown);
  document.documentElement.style.userSelect = "none"; // 禁用文本选中
};
const spaceUp = (e: KeyboardEvent) => {
  e.preventDefault();
  isDragging.value = false;
  e.stopPropagation();
  document.documentElement.style.cursor = "default";
  document.documentElement.style.userSelect = "auto";
  document.removeEventListener("mousedown", handleMouseDown);
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
};

// 动态扩展边界检测
const checkBoundary = () => {
  if (!canvasWrapper.value) return;
};
const handleScrollbar = () => {
  if (!canvasWrapper.value) return;
  checkBoundary();
};
// 生命周期
onMounted(() => {
  if (!canvasWrapper.value) return;
  // 初始居中
  canvasWrapper.value.scrollLeft = size.value.width / 2 - window.innerWidth / 2;
  canvasWrapper.value.scrollTop =
    size.value.height / 2 - window.innerHeight / 2;
});

onUnmounted(() => {
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
});
</script>

<style scoped lang="scss">
.canvas-wrapper {
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  overflow: scroll;
  box-sizing: border-box;
  --canvas-bg-color: 244, 245, 247;
  --canvas-grid-color: 0, 0, 0;
  --canvas-grid-size: 20px;
  .infinite-canvas {
    position: relative;
    min-width: 100%;
    min-height: 100%;
    transition: transform 0.1s ease-out;
    background-color: rgb(var(--canvas-bg-color));
    // background-image: linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    //   linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
    // background-size: var(--canvas-grid-size) var(--canvas-grid-size);
  }
}
</style>
