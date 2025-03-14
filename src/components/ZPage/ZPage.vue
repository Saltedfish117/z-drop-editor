<script setup lang="ts">
import { defineOptions, ref, watch } from "vue";
import ZNode from "../ZNode/ZNode.vue";
import ZLines from "../ZLines/ZLines.vue";
import type { ZNode as Node } from "../ZNode/types";
import type { ZDragEditorModel, ZOption } from "../ZDragEditor/types";
import ZDrag from "../ZDrag/ZDrag.vue";
defineOptions({
  name: "ZPage",
});
const props = defineProps<{
  parent: HTMLElement;
  option: ZOption;
}>();
const page = defineModel<Node>({
  required: true,
});
const store = defineModel<ZDragEditorModel>("store", {
  required: true,
});
const emits = defineEmits<{
  (e: "update:active", value: boolean): void;
  (e: "change", event: MouseEvent, node: Node): void;
}>();
const active = ref<Node | null>(null);
const change = (node?: Node) => {
  store.value.active = node;
};
watch(
  () => store.value.active,
  (value) => {
    if (!value) return (active.value = null);
    if (value.parentId === page.value.id) {
      active.value = value;
    } else {
      active.value = null;
    }
  }
);
const pageRef = ref<HTMLElement | null>(null);
</script>
<template>
  <div>
    <ZDrag
      v-if="active"
      v-model="active.layout"
      position="absolute"
      :parent="(pageRef as HTMLElement)"
      :scale="store.canvas.scale"
      :active="Boolean(active)"
      rotate
    >
    </ZDrag>
    <ZLines
      v-if="option.lines && active && page.children"
      v-model="active"
      :diff="option.lines.diff"
      :interval="option.lines.interval"
      :color="option.lines.color"
      :nodes="page.children"
      :moving="Boolean(active)"
    ></ZLines>
    <article
      :style="{
        width: `${page.layout.width}px`,
        height: `${page.layout.height}px`,
      }"
      ref="pageRef"
      class="ZPage"
    >
      <div
        v-if="page.children"
        v-for="(node, index) in page.children"
        :key="node.id"
        @mousedown.stop="change(node)"
      >
        <ZNode
          v-model:store="store"
          v-model="page.children[index]"
          :parent="(pageRef as HTMLElement)"
        ></ZNode>
      </div>
    </article>
  </div>
</template>
<style scoped lang="scss">
.ZPage {
  overflow: hidden;
  background-color: white;
  box-sizing: border-box;
  position: relative;
}
</style>
