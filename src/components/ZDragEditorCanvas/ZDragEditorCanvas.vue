<script setup lang="ts">
import { ref } from "vue";
import * as d3 from "d3";
defineOptions({
  name: "ZDragEditorCanvas",
  directives: {},
}); // 画布容器引用
const canvasWrapper = ref<HTMLElement | null>(null);
const infiniteCanvas = ref<HTMLElement | null>(null);
</script>
<template>
  <div ref="canvasWrapper" class="canvas-wrapper">
    <article class="infinite-canvas" ref="infiniteCanvas">
      <slot :canvas="infiniteCanvas" name="default"></slot>
    </article>
  </div>
</template>
<style scoped lang="scss">
.canvas-wrapper {
  overflow: scroll;
  box-sizing: border-box;
  background-color: rgb(244, 245, 247);
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
    background-color: rgb(var(--canvas-bg-color));
  }
}
</style>
