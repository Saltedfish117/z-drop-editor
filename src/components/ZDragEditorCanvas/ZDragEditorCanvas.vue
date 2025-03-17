<template>
  <div
    ref="canvasWrapper"
    class="canvas-wrapper"
    :class="{
      'hidden-scrollbar': hiddenScroll,
    }"
    :style="{
      cursor: cursor,
    }"
  >
    <!--   @keydown.space="spaceDown"
      @keyup.space="spaceUp" -->
    <article
      class="infinite-canvas"
      ref="infiniteCanvas"
      :style="{
        width: size.width + 'px',
        height: size.height + 'px',
        transform: `scale(${scale})`,
        pointerEvents: pointerEvents,
      }"
    >
      <slot :canvas="infiniteCanvas" :size="size" name="default"></slot>
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
  defineExpose,
  watch,
  withDefaults,
  computed,
} from "vue";

defineOptions({
  name: "ZDragEditorCanvas",
  directives: {},
});

const props = withDefaults(
  defineProps<{
    size: { width: number; height: number };
    scale: number;
    drag: boolean;
    hiddenScroll: boolean;
  }>(),
  {
    hiddenScroll: false,
    drag: false,
    scale: 1,
  }
);
// 画布容器引用
const canvasWrapper = ref<HTMLElement | null>(null);
const infiniteCanvas = ref<HTMLElement | null>(null);
const dragging = ref(false);
const cursor = ref("default");
const pointerEvents = computed(() => {
  if (props.drag) return "none";
  return dragging.value ? "none" : "auto";
});
// 初始尺寸
const size = defineModel<{
  width: number;
  height: number;
}>("size", {
  type: Object,
  required: true,
  default: () => {
    return {
      width: 5000,
      height: 5000,
    };
  },
});

const startPos = reactive({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
// 拖拽处理
const handleMouseDown = (e: MouseEvent) => {
  if (!canvasWrapper.value) return;
  dragging.value = true;
  startPos.x = e.clientX;
  startPos.y = e.clientY;
  startPos.scrollLeft = canvasWrapper.value.scrollLeft;
  startPos.scrollTop = canvasWrapper.value.scrollTop;
  cursor.value = "grabbing";
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};
const handleMouseMove = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  cursor.value = "grabbing";
  const scaleFactor = 1 / props.scale; // 计算缩放修正因子
  // 根据缩放倍率修正偏移量
  let offsetX = (e.clientX - startPos.x) * scaleFactor;
  let offsetY = (e.clientY - startPos.y) * scaleFactor;
  let resultX = startPos.scrollLeft - offsetX;
  let resultY = startPos.scrollTop - offsetY;
  canvasWrapper.value?.scrollTo(resultX, resultY);
};
const handleMouseUp = (e: MouseEvent) => {
  dragging.value = false;
  e.preventDefault();
  e.stopPropagation();
  cursor.value = "grab";
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
  document.documentElement.style.userSelect = "none";
};
const spaceDown = (e: KeyboardEvent) => {
  if (props.drag) return;
  if (e.key !== " ") return;
  e.preventDefault();
  e.stopPropagation();
  if (dragging.value) return;
  if (!canvasWrapper.value) return;
  dragging.value = true;
  canvasWrapper.value.addEventListener("mousedown", handleMouseDown);
  cursor.value = "grab";
  document.documentElement.style.userSelect = "none"; // 禁用文本选中
};
const spaceUp = (e: KeyboardEvent) => {
  if (props.drag && e.key !== " ") return;
  dragging.value = false;
  e.preventDefault();
  e.stopPropagation();
  if (!canvasWrapper.value) return;
  cursor.value = "default";
  document.documentElement.style.userSelect = "auto";
  canvasWrapper.value.removeEventListener("mousedown", handleMouseDown);
  // document.removeEventListener("mousedown", handleMouseDown);
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
};
defineExpose({
  infiniteCanvas,
  canvasWrapper,
});
watch(
  () => props.drag,
  (val) => {
    if (!canvasWrapper.value) return;
    if (val) {
      canvasWrapper.value.addEventListener("mousedown", handleMouseDown);
      cursor.value = "grab";
      document.documentElement.style.userSelect = "none"; // 禁用文本选中
    } else {
      cursor.value = "default";
      document.documentElement.style.userSelect = "auto";
      canvasWrapper.value.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
  },
  {
    immediate: true,
  }
);
// 生命周期
onMounted(() => {
  if (!canvasWrapper.value) return;
  document.addEventListener("keydown", spaceDown);
  document.addEventListener("keyup", spaceUp);
  // 初始居中
  canvasWrapper.value.scrollLeft = size.value.width / 2 - window.innerWidth / 2;
  canvasWrapper.value.scrollTop =
    size.value.height / 2 - window.innerHeight / 2;
});
onUnmounted(() => {
  document.removeEventListener("keydown", spaceDown);
  document.removeEventListener("keyup", spaceUp);
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
});
</script>

<style scoped lang="scss">
.canvas-wrapper {
  overflow: scroll;
  box-sizing: border-box;
  --canvas-bg-color: 244, 245, 247;
  background-color: rgb(var(--canvas-bg-color));
  // 隐藏滚动条
  &::-webkit-scrollbar {
    background: transparent;
    width: 8px;
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgb(var(--z-quiet));
    border-radius: 8px;
  }
  &.hidden-scrollbar {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
    &::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
      background: transparent;
    }
  }
  .infinite-canvas {
    position: relative;
    min-width: 100%;
    min-height: 100%;
    transition: transform 0.1s ease-out;
    background-color: rgb(var(--canvas-bg-color));
  }
}
</style>
