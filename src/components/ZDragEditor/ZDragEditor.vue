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
  provide,
} from "vue";
import ZDragEditorCanvas from "../ZDragEditorCanvas/ZDragEditorCanvas.vue";
import ZToolbar from "../ZToolbar/ZToolbar.vue";
import ZDrag from "../ZDrag/ZDrag.vue";
import ZNode from "../ZNode/ZNode.vue";
import ZLines from "../ZLines/ZLines.vue";
import type { ZNode as Node } from "../ZNode/types";
import type { ZDragEditorModel, ZNodeMap } from "./types";
// import type { Layout } from "../ZDrag/types";
defineOptions({
  name: "ZDragEditor",
});
const store = defineModel<ZDragEditorModel>({
  required: true,
  default: () => ({
    nodes: [],
    canvas: {
      width: window.innerWidth,
      height: window.innerHeight,
      scale: 0.8,
    },
    active: undefined,
    moving: false,
    components: [],
  }),
});
const useStore = () => {
  return store.value;
};
const nodeMap = reactive<ZNodeMap>(new Map());
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
    store.value.canvas.width = Math.round(nodesWidth * 3);
    store.value.canvas.height = Math.round(maxHeight * 3);
    let startX = Math.round(store.value.canvas.width / 2 - nodesWidth / 2);
    let y = Math.round(store.value.canvas.height / 2 - maxHeight / 2);
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
const zDragRef = ref<InstanceType<typeof ZDrag> | null>(null);
const proxyMousedown = (e: MouseEvent, node?: Node) => {
  console.log("editor", node);
  if (!node) return (store.value.active = undefined);
  if (nodeMap.has(node.id)) {
    store.value.active = nodeMap.get(node.id);
    nextTick(() => {
      if (zDragRef.value) {
        zDragRef.value.mousedown(e, "move");
      }
    });
  } else store.value.active = undefined;
};
const zoomOut = () => {
  if (store.value.canvas.scale - 0.1 < 0.1) return;
  store.value.canvas.scale = Number.parseFloat(
    (store.value.canvas.scale - 0.1).toFixed(1)
  );
};
const zoomIn = () => {
  if (store.value.canvas.scale + 0.1 > 5) return;
  store.value.canvas.scale = Number.parseFloat(
    (store.value.canvas.scale + 0.1).toFixed(1)
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
provide("useStore", useStore);
provide("change", proxyMousedown);
provide("nodeMap", nodeMap);
onUnmounted(() => {
  nodeMap.clear();
});
</script>
<template>
  <article tabindex="0" class="ZDragEditor">
    <ZToolbar
      class="toolbar"
      v-model:node="store.active"
      v-model:scale="store.canvas.scale"
    ></ZToolbar>
    <ZDragEditorCanvas
      @mousewheel="mousewheel"
      :scale="store.canvas.scale"
      v-model:size="store.canvas"
      :scroll="false"
      @mousedown="proxyMousedown"
      class="canvas"
    >
      <template #default="{ canvas }">
        <div>
          <!-- <ZDrag
            v-model="node.layout"
            position="absolute"
            :parent="canvas as HTMLElement"
            :scale="store.canvas.scale"
            :active="Boolean(store.active) && store.active?.id === node.id"
            v-show="Boolean(store.active) && store.active?.id === node.id"
          >
          </ZDrag> -->
          <ZNode
            v-for="node in store.nodes"
            :key="node.id"
            @change="proxyMousedown"
            :node="node"
            :parent="(canvas as HTMLElement)"
          ></ZNode>
          <!-- <ZLines
            :diff="3"
            :interval="10"
            :nodes="store.nodes"
            :moving="Boolean(store.active) && store.active?.id === node.id"
            v-model="store.active"
          ></ZLines> -->
        </div>
      </template>
    </ZDragEditorCanvas>
  </article>
</template>
<style scoped lang="scss">
.ZDragEditor {
  overflow: hidden;
  box-sizing: border-box;
  .toolbar {
    position: fixed;
    top: 0;
  }
  .canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
