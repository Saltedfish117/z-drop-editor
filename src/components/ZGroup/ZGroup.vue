<script setup lang="ts">
import { defineOptions, watch, nextTick, onUnmounted } from "vue";
import type { WatchHandle } from "vue";
import ZNode from "../ZNode/ZNode.vue";
import type { ZNode as Node } from "../ZNode/types";
import { rotateLayout, calculateGroupLayout } from "@/common/utils";
import type { ZDragEditorModel } from "../ZDragEditor/types";
defineOptions({
  name: "ZGroup",
});
const store = defineModel<ZDragEditorModel>("store", {
  required: true,
  default: () => ({
    nodes: [],
    canvas: {
      width: window.innerWidth,
      height: window.innerHeight,
      scale: 0.8,
      drag: false,
    },
    active: undefined,
    moving: false,
    components: [],
  }),
});
const node = defineModel<Node>({
  required: true,
});
node.value.layout = {
  ...node.value.layout,
  ...calculateGroupLayout(node.value.children!),
};
let flag = false;
let start = { ...node.value.layout };
let children: Node["layout"][] =
  node.value.children?.map((node) => {
    return { ...node.layout };
  }) || [];
let stopWatch: WatchHandle | null = null;
const updateChildren = (layout: Node["layout"]) => {
  if (!node.value.children) return;
  node.value.children.forEach((kids, i) => {
    // 计算子元素位置比例
    let childXRatio = (children[i].x - start.x) / start.width;
    let childYRatio = (children[i].y - start.y) / start.height;
    let childWidthRatio = children[i].width / start.width;
    let childHeightRatio = children[i].height / start.height;
    // 根据比例计算子元素位置
    let childXNew = Math.round(layout.x + childXRatio * layout.width);
    let childYNew = Math.round(layout.y + childYRatio * layout.height);
    let childWidthNew = Math.round(childWidthRatio * layout.width);
    let childHeightNew = Math.round(childHeightRatio * layout.height);
    // 更新子元素位置
    kids.layout.x = childXNew;
    kids.layout.y = childYNew;
    kids.layout.width = childWidthNew;
    kids.layout.height = childHeightNew;
  });
};
const once = () => {
  if (flag) return;
  flag = true;
  start = { ...node.value.layout };
  if (!node.value.children) return;
  children = node.value.children.map((node) => {
    return { ...node.layout };
  });
  stopWatch = watch(
    () => node.value.layout,
    (layout) => {
      updateChildren(layout);
    },
    {
      deep: true,
    }
  );
};
watch(
  () => store.value.moving,
  (value) => {
    if (
      value &&
      store.value.active &&
      store.value.active.id === node.value.id
    ) {
      once();
    } else {
      flag = false;
      if (stopWatch) stopWatch();
      nextTick(() => {
        node.value.layout = {
          ...node.value.layout,
          ...calculateGroupLayout(node.value.children!),
        };
      });
      return;
    }
  }
);
onUnmounted(() => {
  if (stopWatch) stopWatch();
});
</script>
<template>
  <ZNode
    v-if="node.children"
    v-for="(kids, i) in node.children"
    :key="kids.id"
    v-model="node.children[i]"
    v-model:store="store"
  ></ZNode>
  <div
    v-bind="$attrs"
    class="z-group"
    :style="{
      width: `${node.layout.width}px`,
      height: `${node.layout.height}px`,
      transform: `translate(${node.layout.x}px,${node.layout.y}px) rotate(${node.layout.rotate}deg)`,
    }"
  ></div>
</template>
<style scoped lang="scss">
.z-group {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  &:hover {
    border: 3px solid rgb(var(--z-primary));
  }
}
</style>
