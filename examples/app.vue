<script setup lang="ts">
import { ref } from "vue";
import type { ZDragNodes, ZCanvasList } from "@/common/type";
import { getId, calculateGroupLayout } from "@/common/utils";
import { createCanvas, createNode } from "@/common/create";
const initArr = Array.from({ length: 1 }, (_, _c) => {
  const canvasId = getId();
  let pageX = 0;
  return createCanvas(canvasId, {
    children: Array.from({ length: 1 }, (_, _p) => {
      const pageId = getId();
      let nodeX = 0;
      const page = createNode({
        id: pageId,
        relative: "canvasId",
        canvasId,
        parentId: canvasId,
        component: "ZPage",
        label: "page",
        type: "page",
        layout: {
          width: 794,
          height: 1123,
          x: pageX,
        },
        hasRotate: false,
        children: Array.from({ length: 3 }, (_, _n) => {
          const nodeId = getId();
          const node = createNode({
            id: nodeId,
            relative: "pageId",
            component: "Rectangle",
            parentId: pageId,
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
let nodeX = 0;
let groupId = getId();
let groupChild = Array.from({ length: 3 }, (_, __) => {
  const nodeId = getId();
  const node = createNode({
    id: nodeId,
    relative: "pageId",
    component: "Rectangle",
    label: "node",
    canvasId: initArr[0].id,
    pageId: initArr[0].children[0].id,
    parentId: groupId,
    type: "component",
    layout: {
      x: nodeX,
      y: 220,
    },
  });
  nodeX += 210;
  return node;
}) as ZDragNodes;
initArr[0].children[0].children?.push(
  createNode({
    id: groupId,
    canvasId: initArr[0].id,
    pageId: initArr[0].children[0].id,
    parentId: initArr[0].children[0].id,
    component: "ZGroup",
    label: "group",
    type: "group",
    layout: {
      ...calculateGroupLayout(groupChild),
      // x: 0,
      // y: 0,
      // width: 200,
      // height: 200,
      rotate: 0,
      zIndex: 1,
      lock: false,
    },
    hasRotate: false,
    relative: "pageId",
    children: groupChild,
  })
);
const canvases = ref(initArr);
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
    type: "component",
  },
];
</script>
<template>
  <article>
    <ZDragEditor :components="components" :canvases="canvases" class="editor">
      <template #right="{ selectCanvas, selectNode }">
        <pre>
        {{ selectCanvas.layout }}
      </pre
        >
        <pre>
        {{ selectNode }}
        </pre>
      </template>
    </ZDragEditor>
  </article>
</template>
<style scoped lang="scss">
.editor {
  width: 100vw;
  height: 100vh;
}
</style>
