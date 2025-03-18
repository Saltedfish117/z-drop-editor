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
const store = defineModel<ZDragEditorModel>("store", {
  required: true,
});
const nodeMap = defineModel<ZNodeMap>("nodeMap", {
  required: true,
});
const emits = defineEmits<{
  (e: "moveEnd"): void;
  (e: "dblclick", node: Node, $event: MouseEvent): void;
}>();
const change = (node?: Node) => {
  store.value.active = node;
};
// watch(
//   () => store.value.active,
//   (value) => {
//     if (!value) return (active.value = null);
//     if (value.parentId === page.value.id) {
//       active.value = value;
//     } else {
//       active.value = null;
//     }
//   },
//   {
//     deep: true,
//   }
// );
// const active = computed(() => {
//   console.log("active", store.value.active);
//   if (store.value.active && store.value.active.parentId) {
//     if (store.value.active.parentId === page.value.id) {
//       return true;
//     } else {
//       let n = nodeMap.value.get(store.value.active.parentId);
//       if (n && n.parentId === page.value.id) {
//         return true;
//       } else {
//         return false;
//       }
//     }
//   } else {
//     return false;
//   }
// });
const pageRef = ref<HTMLElement | null>(null);
// const moveEnd = () => {
//   emits("moveEnd");
// };
// const dblclick = ($event: MouseEvent) => {
//   if (!active.value) return;
//   emits("dblclick", active.value, $event);
// };
</script>
<template>
  <!-- <div
    :style="{
      transform: `translate(${page.layout.x}px,${page.layout.y}px) rotate(${page.layout.rotate}deg)`,
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: page.layout.zIndex,
    }"
  >
    <ZDrag
      @dblclick="dblclick"
      v-if="active"
      v-model="store.active!.layout"
      position="absolute"
      @after-move="moveEnd"
      :container="(pageRef as HTMLElement)"
      :scale="store.canvas.scale"
      :active="active"
      :rotate="store.active!.rotate"
    >
    </ZDrag>
    <ZLines
      v-if="option.lines && active && page.children"
      v-model="store.active"
      :diff="option.lines.diff"
      :interval="option.lines.interval"
      :color="option.lines.color"
      :nodes="page.children"
      :moving="active"
    ></ZLines>
  </div> -->
  <article
    :data-type="page.type"
    :data-id="page.id"
    v-bind="$attrs"
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
        :container="(pageRef as HTMLElement)"
      ></ZNode>
    </div>
  </article>
  <!-- <div
    :style="{
      transform: `translate(${page.layout.x}px,${page.layout.y}px) rotate(${page.layout.rotate}deg)`,
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: page.layout.zIndex,
    }"
  >
    <ZDrag
      @dblclick="dblclick"
      v-if="active"
      v-model="store.active!.layout"
      position="absolute"
      @after-move="moveEnd"
      :container="(pageRef as HTMLElement)"
      :scale="store.canvas.scale"
      :active="active"
      :rotate="store.active!.rotate"
    >
    </ZDrag>
    <ZLines
      v-if="option.lines && active && page.children"
      v-model="store.active"
      :diff="option.lines.diff"
      :interval="option.lines.interval"
      :color="option.lines.color"
      :nodes="page.children"
      :moving="active"
    ></ZLines>
  </div> -->
</template>
<style scoped lang="scss">
.ZPage {
  overflow: hidden;
  background-color: white;
  box-sizing: border-box;
  // position: relative;
}
</style>
