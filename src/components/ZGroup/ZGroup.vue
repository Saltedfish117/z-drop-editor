<script setup lang="ts">
import { defineOptions, watch, nextTick, onUnmounted } from "vue";
import type { WatchHandle } from "vue";
import ZNode from "../ZNode/ZNode.vue";
import type { ZDragNode, ZLayout } from "@/common/type";
import { calculateGroupLayout } from "@/common/utils";
defineOptions({
  name: "ZGroup",
});
const node = defineModel<ZDragNode>({
  required: true,
});
node.value.layout = {
  ...node.value.layout,
  ...calculateGroupLayout(node.value.children!),
};
const emits = defineEmits<{
  (e: "select", node: ZDragNode): void;
}>();
let nodesStartLayout: ZLayout[] = node.value.children!.map((item) => item.layout);
let start: ZLayout = {
  ...node.value.layout,
};
const updateNodes = (layout: ZDragNode["layout"]) => {
  node.value.children!.forEach((kids, i) => {
    // 计算子元素位置比例
    let childXRatio = (nodesStartLayout[i].x - start.x) / start.width;
    let childYRatio = (nodesStartLayout[i].y - start.y) / start.height;
    let childWidthRatio = nodesStartLayout[i].width / start.width;
    let childHeightRatio = nodesStartLayout[i].height / start.height;
    // 根据比例计算子元素位置
    let childXNew = Math.round(layout.x + childXRatio * layout.width);
    let childYNew = Math.round(layout.y + childYRatio * layout.height);
    let childWidthNew = Math.round(childWidthRatio * layout.width);
    let childHeightNew = Math.round(childHeightRatio * layout.height);
    kids.layout = {
      ...kids.layout,
      x: childXNew,
      y: childYNew,
      width: childWidthNew,
      height: childHeightNew,
    };
  });
};
watch(() => node.value.layout, updateNodes);
</script>
<template>
  <ZNode
    v-if="node.children"
    v-for="(kids, i) in node.children"
    :key="kids.id"
    v-model="node.children[i]"
  ></ZNode>
  <!--    class="z-group"
    :style="{
      width: `${node.layout.width}px`,
      height: `${node.layout.height}px`,
      transform: `translate(${node.layout.x}px,${node.layout.y}px) rotate(${node.layout.rotate}deg)`,
    }" -->
  <div v-bind="$attrs"></div>
</template>
<style scoped lang="scss">
.z-group {
  // position: absolute;
  // top: 0;
  // left: 0;
  // box-sizing: border-box;
  // &:hover {
  //   border: 3px solid rgb(var(--z-primary));
  // }
}
</style>
