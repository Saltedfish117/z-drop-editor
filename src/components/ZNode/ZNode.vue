<script setup lang="ts">
import { defineOptions, defineProps, inject, computed } from "vue";
// import type {
//   ZDragEditorModel,
//   ZNodeMap,
// } from "@/components/ZDragEditor/types";
// import type { ZNode, ZNodeProps } from "./types";
// import ZDrag from "@/components/ZDrag/ZDrag.vue";
// import ZLines from "@/components/ZLines/ZLines.vue";
// import type { Layout } from "@/components/ZDrag/types";
defineOptions({
  name: "ZNode",
});
// const props = defineProps<ZNodeProps>();
// const emits = defineEmits<{
//   change: [e: MouseEvent, n: ZNode];
// }>();
const node = defineModel<ZNode>({
  required: true,
});
// const mousedown = (event: MouseEvent) => {
//   emits("change", event, node.value);
// };
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
    <component v-bind="$attrs" :is="node.component" v-model="node"></component>
  </div>
</template>
<style scoped lang="scss">
.ZNode {
  position: absolute;
  top: 0;
  left: 0;
  &:hover {
  }
}
</style>
