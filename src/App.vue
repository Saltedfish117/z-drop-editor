<script setup lang="ts">
import ZDragEditor from "./components/ZDragEditor/ZDragEditor.vue";
import { reactive, ref } from "vue";
import type { ZDragNodes, ZCanvasList } from "@/common/type";
import { getId } from "@/common/utils";
import { createCanvas, createNode } from "@/common/create";
let pageX = 0;
const initArr = Array.from({ length: 2 }, (_, c) => {
  const canvasId = getId();
  return createCanvas(canvasId, {
    children: Array.from({ length: 1 }, (_, p) => {
      const pageId = getId();
      let nodeX = 0;
      const page = createNode({
        id: pageId,
        relative: "canvasId",
        canvasId,
        component: "page",
        label: "page",
        type: "page",
        layout: {
          width: 794,
          height: 1123,
          x: pageX,
        },
        children: Array.from({ length: 3 }, (_, n) => {
          const nodeId = getId();
          const node = createNode({
            id: nodeId,
            relative: "pageId",
            component: "rectangle",
            label: "node",
            canvasId,
            pageId,
            type: "component",
            layout: {
              x: nodeX,
            },
          });
          nodeX += 210;
          return node;
        }) as ZDragNodes,
      });
      pageX += page.layout.width + 50;
      return page;
    }),
  });
}) as ZCanvasList;
const canvasList = ref(initArr);
const components = [
  {
    id: `-kids`,
    component: "rectangle",
    label: "矩形",
    parentId: "",
    layout: {
      x: 0,
      y: 0,
      width: 200,
      height: 200,
      rotate: 0,
      zIndex: 1,
      lock: false,
    },
    rotate: true,
    type: "component",
  },
] as ZDragNodes;
</script>
<template>
  <article>
    <ZDragEditor
      :components="components"
      :canvas="canvasList"
      class="editor"
    ></ZDragEditor>
  </article>
</template>

<style scoped lang="scss">
//
.editor {
  width: 100vw;
  height: 100vh;
}
</style>
