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
import * as d3 from "d3";
// d3.zoom
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
const scale = defineModel<number>("scale", {
  type: Number,
  required: true,
});
const scroll = defineModel<{
  top: number;
  left: number;
}>("scroll", {
  type: Object,
  required: true,
});
const startPos = reactive({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
const modes = {
  drag: {
    use: () => {
      // dom.setArr;
    },
    notUse: () => {},
  },
  select: {
    use: () => {},
    notUse: () => {},
  },
};
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
  scroll.value.left = resultX;
  scroll.value.top = resultY;
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
const zoomOut = () => {
  if (scale.value - 0.1 < 0.1) return;
  scale.value = Number.parseFloat((scale.value - 0.1).toFixed(1));
};
const zoomIn = () => {
  if (scale.value + 0.1 > 5) return;
  scale.value = Number.parseFloat((scale.value + 0.1).toFixed(1));
};
const mousewheel = (e: WheelEvent) => {
  // 判断是不是按下ctrl键
  if (e.ctrlKey) {
    // 取消浏览器默认的放大缩小网页行为
    e.preventDefault();
    // 判断是向上滚动还是向下滚动
    if (e.deltaY > 0) {
      // 缩小重写，业务代码
      zoomOut();
    } else {
      // 放大重写，业务代码
      zoomIn();
    }
  }
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
watch(
  () => scroll.value,
  () => {
    if (!canvasWrapper.value) return;
    canvasWrapper.value.scrollTo({
      left: scroll.value.left,
      top: scroll.value.top,
    });
  },
  {
    deep: true,
  }
);
// 生命周期
onMounted(() => {
  if (!canvasWrapper.value) return;
  document.addEventListener("keydown", spaceDown);
  document.addEventListener("keyup", spaceUp);
  canvasWrapper.value.scrollTo({
    left: scroll.value.left,
    top: scroll.value.top,
  });
});
onUnmounted(() => {
  document.removeEventListener("keydown", spaceDown);
  document.removeEventListener("keyup", spaceUp);
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
});
</script>
<template>
  <div
    ref="canvasWrapper"
    class="canvas-wrapper"
    :class="{
      'hidden-scrollbar': hiddenScroll,
    }"
    @mousewheel="mousewheel"
    :style="{
      cursor: cursor,
    }"
  >
    <article
      class="infinite-canvas"
      ref="infiniteCanvas"
      :style="{
        width: `${size.width}px`,
        height: `${size.height}px`,
        transform: `scale(${scale})`,
        pointerEvents: pointerEvents,
      }"
    >
      <slot :canvas="infiniteCanvas" :size="size" name="default"></slot>
    </article>
  </div>
</template>
<style scoped lang="scss">
.canvas-wrapper {
  overflow: scroll;
  box-sizing: border-box;
  --canvas-bg-color: 244, 245, 247;
  background-color: rgb(var(--canvas-bg-color));
  position: relative;
  // 隐藏滚动条
  &::-webkit-scrollbar {
    // background: transparent;
    width: 8px;
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #a7a7a7;
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
    // transition: transform 0.1s ease-out;
    background-color: rgb(var(--canvas-bg-color));
  }
}
</style>
