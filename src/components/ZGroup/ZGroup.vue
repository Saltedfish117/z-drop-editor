<script setup lang="ts">
import { defineOptions, inject, onUnmounted, ref } from "vue";
import ZNode from "../ZNode/ZNode.vue";
import type { ZDragNode, ZLayout } from "@/common/type";
import { calculateGroupLayout } from "@/common/utils";
defineOptions({
  name: "ZGroup",
});
const node = defineModel<ZDragNode>({
  required: true,
});
const groupRef = ref<HTMLDivElement | null>(null);
node.value.layout = {
  ...node.value.layout,
  ...calculateGroupLayout(node.value.children!),
};
const onDragMove = inject("onDragMove") as (fn: () => void,id:string) => void;
const onDragEnd = inject("onDragEnd") as (fn: () => void,id:string) => void;
const onDragStart = inject("onDragStart") as (fn: () => void,id:string) => void;
// const selectCanvas = inject("selectCanvas") as Ref<ZCanvas>;
// const emits = defineEmits<{
//   (e: "select", node: ZDragNode): void;
//   (e: "dblclick", event: { clientX: number; clientY: number }, node: ZDragNode): void;
// }>();
let nodesStartLayout: ZLayout[] = node.value.children!.map((item) => item.layout);
let start: ZLayout = {
  ...node.value.layout,
};
const resizeStart = () => {
  nodesStartLayout = node.value.children!.map((item) => item!.layout);
  start = {
    ...node.value.layout,
    ...calculateGroupLayout(node.value.children!),
  };
  node.value.layout = {
    ...start,
  };
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
onDragStart(() => {
  resizeStart();
},node.value.id);
onDragMove(() => {
  updateNodes(node.value.layout);
},node.value.id);
onDragEnd(() => {
  resizeStart();
},node.value.id);
onUnmounted(() => {});
</script>
<template>
  <ZNode
    v-if="node.children"
    v-for="(kids, i) in node.children"
    :key="kids.id"
    v-model="node.children[i]"
  ></ZNode>
  <div ref="groupRef" v-bind="$attrs"></div>
</template>
<style scoped lang="scss">
.z-group {
  // position: absolute;
  // top: 0;
  // left: 0;
  // box-sizing: border-box;
  &:hover {
    border: 3px solid rgb(var(--z-primary));
  }
}
</style>
