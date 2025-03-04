<script setup lang="ts">
import {
  defineOptions,
  defineModel,
  computed,
  ref,
  watch,
  nextTick,
  reactive,
  onUnmounted,
} from "vue";
import ZDragEditorCanvas from "../ZDragEditorCanvas/ZDragEditorCanvas.vue";
import ZToolbar from "../ZToolbar/ZToolbar.vue";
import ZDrag from "../ZDrag/ZDrag.vue";
import ZNode from "../ZNode/ZNode.vue";
import ZLines from "../ZLines/ZLines.vue";
import type { ZNode as Node } from "../ZNode/types";
import type { ZDragEditorModel } from "./types";
import type { Layout } from "../ZDrag/types";
defineOptions({
  name: "ZDragEditor",
});
const store = defineModel<ZDragEditorModel>({
  required: true,
});
const nodeMap = reactive(new Map());
const canvasSize = ref({
  width: 0,
  height: 0,
  scale: 0.8,
});
watch(
  () => store.value.nodes,
  (val) => {
    const recursive = (node: Node) => {
      nodeMap.set(node.id, node);
      if (node.children?.length) {
        node.children.forEach((child) => recursive(child));
      }
    };
    let nodesWidth =
      val.reduce((prev, curr) => (prev += curr.layout.width), 0) +
      50 * val.length;
    let maxHeight = Math.max(...val.map((i) => i.layout.height));
    canvasSize.value.width = Math.round(nodesWidth * 20);
    canvasSize.value.height = Math.round(maxHeight * 20);
    let startX = Math.round(canvasSize.value.width / 2 - nodesWidth / 2);
    let y = Math.round(canvasSize.value.height / 2 - maxHeight / 2);
    val.forEach((node) => {
      node.layout.x = startX + 50;
      startX += node.layout.width + 50;
      node.layout.y = y;
      recursive(node);
    });
  },
  {
    immediate: true,
    once: true,
  }
);
const active = computed(() => !!store.value.active);
const moving = ref(false);
const activeLayout = computed({
  get: () => {
    if (store.value.active && store.value.active.layout) {
      return store.value.active.layout;
    } else {
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        rotate: 0,
        zIndex: 1,
        lock: false,
      };
    }
  },
  set: (val: Layout) => {
    if (store.value.active && store.value.active.layout) {
      store.value.active.layout = val;
    } else {
      return;
    }
  },
});
const zDragRef = ref<InstanceType<typeof ZDrag> | null>(null);
const proxyMouseDown = (e: MouseEvent, node?: Node) => {
  if (!node) return (store.value.active = null);
  if (nodeMap.has(node.id)) {
    store.value.active = nodeMap.get(node.id);
    nextTick(() => {
      if (zDragRef.value) {
        zDragRef.value.mousedown(e, "move");
      }
    });
  } else store.value.active = null;
};
const zoomOut = () => {
  if (canvasSize.value.scale - 0.1 < 0.1) return;
  canvasSize.value.scale = Number.parseFloat(
    (canvasSize.value.scale - 0.1).toFixed(1)
  );
};
const zoomIn = () => {
  if (canvasSize.value.scale + 0.1 > 5) return;
  canvasSize.value.scale = Number.parseFloat(
    (canvasSize.value.scale + 0.1).toFixed(1)
  );
};
const mousewheel = (e: WheelEvent) => {
  // 判断是不是按下ctrl键
  if (e.ctrlKey) {
    // 取消浏览器默认的放大缩小网页行为
    e.preventDefault();
    // 判断是向上滚动还是向下滚动
    if (e.deltaY > 0) {
      // 缩小重写，业务代码
      zoomOut();
    } else {
      // 放大重写，业务代码
      zoomIn();
    }
  }
};
onUnmounted(() => {
  nodeMap.clear();
});
</script>
<template>
  <article tabindex="0" class="ZDragEditor">
    <ZToolbar v-model:scale="canvasSize.scale"></ZToolbar>
    <ZDragEditorCanvas
      @mousewheel="mousewheel"
      :scale="canvasSize.scale"
      v-model:size="canvasSize"
      @mousedown="proxyMouseDown"
    >
      <template #default="{ canvasSize }">
        <ZNode
          @mousedown.stop="proxyMouseDown($event, node)"
          v-for="node in store.nodes"
          :key="node.id"
          :active="active"
          :node="node"
          :canvasSize="canvasSize"
        ></ZNode>
        <ZDrag
          @before-move="moving = true"
          @after-move="moving = false"
          @moving="moving = true"
          :scale="canvasSize.scale"
          ref="zDragRef"
          :position="'absolute'"
          v-model:active="active"
          v-model="activeLayout"
        ></ZDrag>
        <ZLines
          :diff="3"
          :interval="10"
          :nodes="store.nodes"
          :scale="canvasSize.scale"
          :nodeMap="nodeMap"
          v-model:moving="moving"
          v-model="store.active"
        ></ZLines>
      </template>
    </ZDragEditorCanvas>
  </article>
</template>
<style scoped lang="scss">
.ZDragEditor {
  width: 100vw;
  height: 100vh;
  overflow: auto;
  box-sizing: border-box;
}
</style>
