<script setup lang="ts">
import { defineOptions, ref, watch, computed } from "vue";
import ZNode from "../ZNode/ZNode.vue";
import ZLines from "../ZLines/ZLines.vue";
import type { ZNode as Node } from "../ZNode/types";
import type { ZDragEditorModel, ZOption, ZNodeMap } from "../ZDragEditor/types";
import ZDrag from "../ZDrag/ZDrag.vue";
defineOptions({
  name: "ZPage",
});
defineProps<{
  container: HTMLElement;
  option: ZOption;
}>();
const page = defineModel<Node>({
  required: true,
});
const emits = defineEmits<{
  (e: "moveEnd"): void;
  (e: "dblclick", node: Node, $event: MouseEvent): void;
}>();
const change = (node?: Node) => {
  store.value.active = node;
};
const pageRef = ref<HTMLElement | null>(null);
</script>
<template>
  <article
    :data-type="page.type"
    :data-id="page.id"
    :id="page.id"
    v-bind="$attrs"
    ref="pageRef"
    class="ZPage"
  >
    <ZNode
      v-if="page.children"
      v-for="(node, index) in page.children"
      :key="node.id"
      v-bind="$attrs"
      v-model:store="store"
      v-model="page.children[index]"
    ></ZNode>
  </article>
</template>
<style scoped lang="scss">
.ZPage {
  overflow: hidden;
  background-color: white;
  box-sizing: border-box;
}
</style>
