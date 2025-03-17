<script setup lang="ts">
import { defineOptions, ref, withDefaults } from "vue";
defineOptions({
  name: "ZSplitter",
});
const props = withDefaults(
  defineProps<{
    leftMinWidth?: number;
    rightMinWidth?: number;
    leftHidden?: boolean;
    rightHidden?: boolean;
  }>(),
  {
    leftHidden: false,
    rightHidden: false,
    leftMinWidth: 200,
    rightMinWidth: 200,
  }
);
const leftWidth = ref(props.leftMinWidth);
const rightWidth = ref(props.rightMinWidth);
const dragLeft = ref(false);
const dragRight = ref(false);
const handleMouseDown = (e: MouseEvent, direction: "left" | "right") => {
  try {
    const widthMap = {
      left: leftWidth,
      right: rightWidth,
    };
    const dragMap = {
      left: () => (dragLeft.value = dragLeft.value),
      right: () => (dragRight.value = dragRight.value),
    };
    dragMap[direction]();
    const width = widthMap[direction];
    const startX = e.clientX;
    const startWidth = width.value;
    const handleMouseMove = (e: MouseEvent) => {
      const offset = e.clientX - startX;
      const calculateMap = {
        left: () => {
          let result = startWidth + offset;
          if (result < props.leftMinWidth) return width.value;
          return result;
        },
        right: () => {
          let result = startWidth - offset;
          if (result < props.rightMinWidth) return width.value;
          return result;
        },
      };
      width.value = calculateMap[direction]();
    };
    const handleMouseUp = () => {
      dragMap[direction]();
      document.documentElement.style.userSelect = "auto";
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
    document.documentElement.style.userSelect = "none";
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
  } catch (error) {
    console.log(error);
  }
};
</script>
<template>
  <div class="ZSplitter">
    <div
      class="left-pane"
      :class="{
        out: leftHidden,
      }"
      :style="{ width: `${leftHidden ? 0 : leftWidth}px` }"
    >
      <div class="content"><slot :width="leftWidth" name="left"></slot></div>
    </div>

    <div
      class="splitter-bar"
      @mousedown="handleMouseDown($event, 'left')"
      :class="{ active: dragLeft }"
    ></div>
    <div class="center-pane">
      <slot name="center"></slot>
    </div>
    <div
      class="splitter-bar"
      @mousedown="handleMouseDown($event, 'right')"
      :class="{ active: dragRight }"
    ></div>
    <div
      class="right-pane"
      :class="{
        out: rightHidden,
      }"
      :style="{ width: `${rightHidden ? 0 : rightWidth}px` }"
    >
      <div class="content"><slot :width="rightWidth" name="right"></slot></div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.ZSplitter {
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;
  .left-pane,
  .right-pane {
    background: rgb(var(--z-page));
    overflow: auto;
  }
  .center-pane {
    flex: 1;
    background: rgb(var(--z-page));
    overflow: auto;
  }
  .splitter-bar {
    width: 2px;
    background: rgb(var(--z-quiet));
    cursor: col-resize;
    transition: background 0.2s;
    &:hover,
    &.active {
      width: 2px;
      background: rgba(var(--z-primary), 0.6);
    }
  }
  .left-pane.out {
    transition: width 0.3s;
    .content {
      opacity: 0;
    }
  }
  .right-pane.out {
    transition: width 0.3s;
    .content {
      opacity: 0;
    }
  }
}
</style>
