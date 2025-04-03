<script setup lang="ts">
import { defineOptions, computed, defineEmits, withDefaults } from "vue";
import type { CssProperties } from "vue";
import type { ZMap, ZLayout, ZDragNode } from "@/common/type";
import { rotateLayout, getId } from "@/common/utils";
import { filter, quadtree, reduce, select, style } from "d3";
import type ZDrag from "../ZDrag";
defineOptions({
  name: "ZLines",
});
//    modelValue?: ZLayout;
const props = withDefaults(
  defineProps<{
    treeMap: ZMap;
    selectNode: ZDragNode;
    diff?: number;
    wrapper: HTMLElement;
  }>(),
  {
    diff: 8,
  }
);
// const emits = defineEmits(["update:modelValue"]);
const model = defineModel<ZLayout>({
  default: () => ({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    zIndex: 1,
    rotate: 0,
    lock: false,
  }),
});
const nodes = computed(() => {
  let parent = props.treeMap.get(props.selectNode.parentId as string);
  if (!parent) return [];
  if (parent.type === "group")
    parent = props.treeMap.get((parent as ZDragNode).parentId as string)!;
  console.log("parent", parent);
  const ns = parent.children!.filter((item) => item.id !== props.selectNode.id);
  return ns.map((item: ZDragNode) => {
    const container = props.treeMap.get(item[item.relative] as string)!;
    let layout = {
      ...item.layout,
      // x: container.layout.x + item.layout.x,
      // y: container.layout.y + item.layout.y,
    };
    if (container.type === "canvas") {
      layout = {
        ...item.layout,
      };
    } else {
      layout = {
        ...item.layout,
        x: container.layout.x + item.layout.x,
        y: container.layout.y + item.layout.y,
      };
    }
    return {
      id: item.id,
      layout: rotateLayout(layout),
    };
  });
});
// const nodeRects = computed(() => {
//   return nodes.value.map((item) => {
//     return {
//       ...item,
//       rect: getRect(item.layout),
//     };
//   });
// });
// const trees = computed(() => {
//   let vertical = nodeVertical.value;
//   // const tree = {
//   //   left: quadtree().addAll(vertical.map((item) => item[0])),
//   //   right: quadtree().addAll(vertical.map((item) => item[1])),
//   //   center: quadtree().addAll(vertical.map((item) => item[2])),
//   //   top: quadtree().addAll(vertical.map((item) => item[3])),
//   //   bottom: quadtree().addAll(vertical.map((item) => item[4])),
//   // };
// });
// const recently = computed(() => {
//   return quadtree<ZDragNode>()
//     .x((item) => item.layout.x + item.layout.width / 2)
//     .y((item) => item.layout.y + item.layout.height / 2)
//     .addAll(nodes.value)
//     .find(
//       props.modelValue.x + props.modelValue.width / 2,
//       props.modelValue.y + props.modelValue.height / 2
//     );
// });
const lineSize = "3px";
const lines = computed<CssProperties[]>(() => {
  return [];
});
</script>
<template>
  <div v-for="line in lines" :style="line" :key="getId()" class="z-lines"></div>
</template>
<style scoped lang="scss">
.z-lines {
  position: absolute;
  background-color: rgb(var(--z-primary));
  z-index: 1000;
  top: 0;
  left: 0;
}
</style>
