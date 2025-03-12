<script setup lang="ts">
import { defineOptions, ref } from "vue";
import ZNode from "../ZNode/ZNode.vue";
import type { ZNode as Node } from "../ZNode/types";
import ZDrag from "../ZDrag/ZDrag.vue";
defineOptions({
  name: "ZPage",
});
const props = defineProps<{
  // active: boolean;
  node: Node;
}>();
// const active = defineModel<Node | undefined>();
const emits = defineEmits<{
  (e: "update:active", value: boolean): void;
  (e: "change", event: MouseEvent, node: Node): void;
}>();
const proxyMousedown = (e: MouseEvent, node: Node) => {
  console.log(node);
  emits("change", e, node);
};
const page = ref<HTMLElement | null>(null);
//
</script>
<template>
  <article ref="page" class="ZPage">
    <ZNode
      v-for="kids in node.children"
      :key="kids.id"
      :node="kids"
      :parent="(page as HTMLElement)"
      @mousedown.stop="proxyMousedown($event, kids)"
    ></ZNode>
  </article>
</template>
<style scoped lang="scss">
.ZPage {
  overflow: hidden;
  background-color: white;
}
</style>
