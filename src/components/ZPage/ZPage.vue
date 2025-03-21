<script setup lang="ts">
import { defineOptions, ref, watch, computed, defineEmits } from "vue";
import ZNode from "../ZNode/ZNode.vue";
import type { ZDragNode } from "@/common/type";
import ZLines from "../ZLines/ZLines.vue";
import type { ZNode as Node } from "../ZNode/types";
import type { ZDragEditorModel, ZOption, ZNodeMap } from "../ZDragEditor/type";
import ZDrag from "../ZDrag/ZDrag.vue";
defineOptions({
  name: "ZPage",
});
const pageRef = ref<HTMLElement | null>(null);
const emits = defineEmits<{
  (e: "select", node: ZDragNode): void;
  (
    e: "drop",
    event: DragEvent,
    data: {
      containerId: string;
      container: HTMLElement;
    }
  ): void;
}>();
const page = defineModel<Node>({
  required: true,
});

const mousedown = (node: ZDragNode) => {
  // console.log("page set", node);
  emits("select", node);
};
const dragover = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
};
const drop = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  emits("drop", e, {
    containerId: page.value.id,
    container: pageRef.value as HTMLElement,
  });
};
</script>
<template>
  <article
    :data-type="page.type"
    :data-pageId="page.id"
    :id="page.id"
    v-bind="$attrs"
    ref="pageRef"
    @drop="drop"
    @dragover="dragover"
    class="ZPage"
  >
    <ZNode
      v-if="page.children"
      v-for="(node, index) in page.children"
      :key="node.id"
      @mousedown.stop="mousedown(node)"
      @select="$emit('select', $event)"
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
