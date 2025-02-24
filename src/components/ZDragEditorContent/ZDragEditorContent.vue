<template>
  <div
    ref="canvasWrapper"
    class="canvas-wrapper"
    tabindex="-1"
    @keydown.space="spaceDown"
    @keyup.space="spaceUp"
  >
    <article
      class="infinite-canvas"
      :style="{
        width: canvasSize.width + 'px',
        height: canvasSize.height + 'px',
      }"
    >
      
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
  computed,
} from "vue";

defineOptions({
  name: "ZDragEditorContent",
  directives: {},
});
// 画布容器引用
const canvasWrapper = ref<HTMLElement | null>(null);
// 画布状态
const canvasSize = reactive({ width: 3000, height: 3000 }); // 初始尺寸
const offset = reactive({ x: 0, y: 0 });
const isDragging = ref(false);
const startPos = reactive({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
// // 拖拽处理
const handleMouseDown = (el: MouseEvent) => {
  if (!canvasWrapper.value) return;
  startPos.x = el.clientX;
  startPos.y = el.clientY;
  startPos.scrollLeft = canvasWrapper.value.scrollLeft;
  startPos.scrollTop = canvasWrapper.value.scrollTop;
  document.body.style.cursor = "grabbing";
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};
const handleMouseMove = (el: MouseEvent) => {
  // if (el.currentTarget)
  //   (el.currentTarget as HTMLElement)!.style.pointerEvents = "none";
  document.body.style.cursor = "grabbing";
  let offsetX = el.clientX - startPos.x;
  let offsetY = el.clientY - startPos.y;
  let resultX = startPos.scrollLeft - offsetX;
  let resultY = startPos.scrollTop - offsetY;
  // checkBoundary(resultX, resultY);
  canvasWrapper.value?.scrollTo(resultX, resultY);
};
const handleMouseUp = () => {
  isDragging.value = false;
  document.body.style.cursor = "grab";
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
  document.body.style.userSelect = "none";
};
const spaceDown = (e: KeyboardEvent) => {
  e.preventDefault();
  document.body.style.cursor = "grab";
  document.addEventListener("mousedown", handleMouseDown);
  document.body.style.userSelect = "none"; // 禁用文本选中
};
const spaceUp = (e: KeyboardEvent) => {
  e.preventDefault();
  document.body.style.cursor = "default";
  document.removeEventListener("mousedown", handleMouseDown);
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
};

// 动态扩展边界检测
// const checkBoundary = (x: number, y: number) => {
//   if (!canvasWrapper.value) return;
//   if (x < 0 || x > canvasWrapper.value.offsetWidth) {
//     canvasSize.width += Math.abs(x);
//   }
//   if (y < 0 || y > canvasWrapper.value.offsetHeight) {
//     canvasSize.height += Math.abs(y);
//   }
// };
// 内容定位（示例）
const contentPosition = computed(() => ({
  left: canvasSize.width / 2 + "px",
  top: canvasSize.height / 2 + "px",
}));
// 生命周期
onMounted(() => {
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

<style scoped>
.canvas-wrapper {
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  overflow: scroll;
  box-sizing: border-box;
  /* cursor: grabbing; */
}
.infinite-canvas {
  position: relative;
  min-width: 100%;
  min-height: 100%;
  background-color: rgb(211, 217, 223);
  transition: transform 0.1s ease-out;
  background-image: linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

.content {
  position: absolute;
  background-color: aqua;
  top: 0;
  left: 0;
}
</style>
