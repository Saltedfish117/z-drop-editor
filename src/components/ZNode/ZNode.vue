<script setup lang="ts">
import { defineOptions, defineProps, defineModel } from "vue";
import type { ZNodeProps } from "./types";
defineOptions({
  name: "ZNode",
});
defineProps<ZNodeProps>();
// const model = defineModel<ZNodeProps["node"]>();
// console.log(model.value);
</script>
<template>
  <div
    :style="{
      width: `${node.layout.width}px`,
      height: `${node.layout.height}px`,
      transform: `translate(${node.layout.x}px,${node.layout.y}px) rotate(${node.layout.rotate}deg)`,
    }"
    class="ZNode"
  >
    <component :is="node.component" v-bind="$attrs"></component>
  </div>
</template>
<style scoped lang="scss">
.ZNode {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
