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
defineProps<{
  container: HTMLElement;
  option: ZOption;
}>();
const page = defineModel<Node>({
  required: true,
});
const store = defineModel<ZDragEditorModel>("store", {
  required: true,
});
const emits = defineEmits<{
  (e: "moveEnd"): void;
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
  },
  {
    deep: true,
  }
);
const pageRef = ref<HTMLElement | null>(null);
const moveEnd = () => {
  emits("moveEnd");
};
</script>
<template>
  <!-- <div> -->

  <!--    width: `${page.layout.width}px`,
      height: `${page.layout.height}px`,
        :style="{
      width: `${page.layout.width}px`,
      height: `${page.layout.height}px`,
    }" -->

  <div
    :style="{
      transform: `translate(${page.layout.x}px,${page.layout.y}px) rotate(${page.layout.rotate}deg)`,
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: page.layout.zIndex,
    }"
  >
    <ZDrag
      v-if="active"
      v-model="active.layout"
      position="absolute"
      @after-move="moveEnd"
      :container="(pageRef as HTMLElement)"
      :scale="store.canvas.scale"
      :active="Boolean(active)"
      :rotate="active.rotate"
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
  </div>
  <article v-bind="$attrs" ref="pageRef" class="ZPage">
    <div
      v-if="page.children"
      v-for="(node, index) in page.children"
      :key="node.id"
      @mousedown.stop="change(node)"
    >
      <ZNode
        v-model:store="store"
        v-model="page.children[index]"
        :container="(pageRef as HTMLElement)"
      ></ZNode>
    </div>
  </article>

  <!-- </div> -->
</template>
<style scoped lang="scss">
.ZPage {
  overflow: hidden;
  background-color: white;
  box-sizing: border-box;
  // position: relative;
}
</style>
