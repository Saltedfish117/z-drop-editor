<script setup lang="ts">
import { defineOptions, computed, watch } from "vue";
import ZNode from "../ZNode/ZNode.vue";
import type { ZNode as Node } from "../ZNode/types";
import { rotateLayout } from "@/common/utils";

defineOptions({
  name: "ZGroup",
});
const node = defineModel<Node>({
  required: true,
});
const calculateGroupLayout = () => {
  if (!node.value.children)
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      zIndex: 0,
      lock: false,
      rotate: 0,
    };
  const layouts = node.value.children?.map((kid) => {
    return rotateLayout(kid.layout);
  });
  const xs = layouts.map((kid) => kid.x);
  const ys = layouts.map((kid) => kid.y);
  const is = layouts.map((kid) => kid.zIndex);
  const mw = layouts.reduce((prev, curr) => {
    return prev.x + prev.width > curr.x + curr.width ? prev : curr;
  });
  const mh = layouts.reduce((prev, curr) => {
    return prev.y + prev.height > curr.y + curr.height ? prev : curr;
  });
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  const w = mw.x + mw.width - x;
  const h = mh.y + mh.height - y;
  const z = Math.max(...is);
  return {
    x: x,
    y: y,
    width: w,
    height: h,
    zIndex: z,
    lock: false,
    rotate: 0,
  };
};
watch(
  () => node.value.children,
  () => {
    node.value.layout = calculateGroupLayout();
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>
<template>
  <!-- <div class="ZGroup"> -->
  <ZNode
    v-if="node.children"
    v-for="(kids, i) in node.children"
    :key="kids.id"
    v-model="node.children[i]"
  ></ZNode>
  <div
    class="ZGroup"
    :style="{
      width: `${node.layout.width}px`,
      height: `${node.layout.height}px`,
      transform: `translate(${node.layout.x}px,${node.layout.y}px) rotate(${node.layout.rotate}deg)`,
    }"
  ></div>
  <!-- </div> -->
</template>
<style scoped lang="scss">
.ZGroup {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  &:hover {
    background: linear-gradient(
          to left,
          rgb(var(--z-primary)),
          rgb(var(--z-primary))
        )
        no-repeat,
      linear-gradient(to bottom, rgb(var(--z-primary)), rgb(var(--z-primary)))
        left top no-repeat,
      linear-gradient(to right, rgb(var(--z-primary)), rgb(var(--z-primary)))
        right bottom no-repeat,
      linear-gradient(to bottom, rgb(var(--z-primary)), rgb(var(--z-primary)))
        right top no-repeat;
    background-size: 100% 3px, 3px 100%, 100% 3px, 3px 100%;
    background-clip: border-box;
  }
}
</style>
