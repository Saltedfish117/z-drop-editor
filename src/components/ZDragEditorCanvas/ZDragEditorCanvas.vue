<template>
  <div ref="canvasWrapper" @scroll="handleScrollbar" class="canvas-wrapper">
    <article
      tabindex="-1"
      @keydown.space="spaceDown"
      @keyup.space="spaceUp"
      class="infinite-canvas"
      :style="{
        width: canvasSize.width + 'px',
        height: canvasSize.height + 'px',
      }"
    >
      <slot
        :isDragging="isDragging"
        :canvasSize="canvasSize"
        name="default"
      ></slot>
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, defineOptions } from "vue";

defineOptions({
  name: "ZDragEditorCanvas",
  directives: {},
});
defineProps({});
// 画布容器引用
const canvasWrapper = ref<HTMLElement | null>(null);
// 画布状态
const canvasSize = reactive({ width: 5000, height: 5000 }); // 初始尺寸
const isDragging = ref(false);
const startPos = reactive({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
// // 拖拽处理
const handleMouseDown = (e: MouseEvent) => {
  if (!canvasWrapper.value) return;
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
  let offsetX = e.clientX - startPos.x;
  let offsetY = e.clientY - startPos.y;
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
  document.body.style.userSelect = "none"; // 禁用文本选中
};
const spaceUp = (e: KeyboardEvent) => {
  e.preventDefault();
  isDragging.value = false;
  e.stopPropagation();
  document.documentElement.style.cursor = "default";
  document.removeEventListener("mousedown", handleMouseDown);
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
};

// 动态扩展边界检测
const checkBoundary = () => {
  if (!canvasWrapper.value) return;
  // if (
  //   canvasWrapper.value.scrollLeft + canvasWrapper.value.clientWidth >
  //   canvasSize.width
  // ) {
  //   canvasSize.width += 10;
  // } else if (canvasWrapper.value.scrollLeft <= 300) {
  //   canvasSize.width += 10;
  // }
  // console.log("checkBoundary", canvasWrapper.value.scrollLeft);
};
const handleScrollbar = () => {
  if (!canvasWrapper.value) return;
  checkBoundary();
};
// 生命周期
onMounted(() => {
  if (!canvasWrapper.value) return;
  // 初始居中
  canvasWrapper.value.scrollLeft = canvasSize.width / 2 - window.innerWidth / 2;
  canvasWrapper.value.scrollTop =
    canvasSize.height / 2 - window.innerHeight / 2;
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
