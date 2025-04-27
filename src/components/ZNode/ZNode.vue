<script setup lang="ts">
import { defineOptions, computed } from "vue";
import type { ZDragNode } from "@/common/type";
import type { CSSProperties } from "vue";
defineOptions({
  name: "ZNode",
});
const node = defineModel<ZDragNode>({
  required: true,
});
const style = computed<CSSProperties>(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: `${node.value.layout.width}px`,
  height: `${node.value.layout.height}px`,
  transform: `translate(${node.value.layout.x}px,${node.value.layout.y}px) rotate(${node.value.layout.rotate}deg)`,
}));
</script>
<template>
  <component
    :style="style"
    v-bind="$attrs"
    :is="node.component"
    v-model="node"
    class="z-node"
  ></component>
</template>
<style lang="scss">
.z-node {
  box-sizing: border-box;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
  }
  &:hover {
    &::after {
      border: 3px solid rgb(var(--z-primary));
    }
  }
}
</style>
