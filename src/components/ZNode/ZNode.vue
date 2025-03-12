<script setup lang="ts">
import { defineOptions, defineProps, inject, computed } from "vue";
import type {
  ZDragEditorModel,
  ZNodeMap,
} from "@/components/ZDragEditor/types";
import type { ZNode, ZNodeProps } from "./types";
import ZDrag from "@/components/ZDrag/ZDrag.vue";
import ZLines from "@/components/ZLines/ZLines.vue";
import type { Layout } from "@/components/ZDrag/types";
defineOptions({
  name: "ZNode",
});
const props = defineProps<ZNodeProps>();
const useStore = inject<() => ZDragEditorModel>("useStore");
if (!useStore) throw new Error("未能注入store");
const store = useStore();
const change = inject<(e: MouseEvent, n: ZNode) => void>("change");
if (!change) throw new Error("未能注入change");
const nodeMap = inject<ZNodeMap>("nodeMap");
if (!nodeMap) throw new Error("未能注入nodeMap");
const nodes = computed(() => {
  let parent = undefined;
  if (
    nodeMap.has(props.node.parentId as string) &&
    (parent = nodeMap.get(props.node.parentId as string)) &&
    parent.children
  ) {
    return parent.children.filter((n) => n.id !== props.node.id);
  } else {
    return store.nodes.filter((n) => n.id !== props.node.id);
  }
});
// const currentNode = computed({
//   get() {
//     return nodeMap.get(props.node.id) as ZNode;
//   },
//   set(val: ZNode) {
//     nodeMap.set(props.node.id, val);
//   },
// });
// const layout = computed({
//   get() {
//     return currentNode.value.layout;
//   },
//   set(val: Layout) {
//     const node = nodeMap.get(props.node.id);
//     if (!node) throw new Error("node not found");
//     node.layout = val;
//   },
// });
</script>
<template>
  <!--   :style="{
        width: `${node.layout.width}px`,
        height: `${node.layout.height}px`,
        transform: `translate(${node.layout.x}px,${node.layout.y}px) rotate(${node.layout.rotate}deg)`,
      }"
      class="ZNode" -->
  <div @mousedown.stop="change($event, node)">
    <ZDrag
      v-model="(store.active as ZNode).layout"
      position="absolute"
      :parent="parent"
      :scale="store.canvas.scale"
      :active="Boolean(store.active) && store.active?.id === node.id"
      v-if="Boolean(store.active) && store.active?.id === node.id"
    >
    </ZDrag>
    <component
      :style="{
        width: `${node.layout.width}px`,
        height: `${node.layout.height}px`,
        transform: `translate(${node.layout.x}px,${node.layout.y}px) rotate(${node.layout.rotate}deg)`,
      }"
      class="ZNode"
      v-bind="$attrs"
      :is="node.component"
      :node="node"
    ></component>
    <ZLines
      :diff="3"
      :interval="10"
      :nodes="nodes"
      :moving="Boolean(store.active) && store.active?.id === node.id"
      v-model="store.active"
    ></ZLines>
  </div>
</template>
<style scoped lang="scss">
.ZNode {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
