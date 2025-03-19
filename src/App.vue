<script setup lang="ts">
import ZDragEditor from "./components/ZDragEditor/ZDragEditor.vue";
import { reactive } from "vue";
import type { ZDragNodes } from "@/common/type";

let arr = Array.from({ length: 1 }, (_, k) => {
  return {
    id: (k + 1).toString(),
    component: "page",
    layout: {
      x: 0,
      y: 0,
      width: 794,
      height: 1123,
      rotate: 0,
      zIndex: 1,
      lock: false,
    },
    rotate: false,
    type: "page",
    relativeCanvas: "canvas",
    children: [
      {
        id: (k + 1).toString() + `-kids`,
        component: "Rectangle",
        parentId: (k + 1).toString(),
        layout: {
          x: 0,
          y: 0,
          width: 200,
          height: 200,
          rotate: 0,
          zIndex: 1,
          lock: false,
        },
        relativeCanvas: (k + 1).toString(),
        type: "component",
      },
      {
        id: (k + 2).toString() + `-Group-3`,
        component: "Group",
        label: "分组",
        parentId: (k + 1).toString(),
        rotate: false,
        layout: {
          x: 200,
          y: 0,
          width: 0,
          height: 0,
          rotate: 0,
          zIndex: 1,
          lock: false,
        },
        relativeCanvas: (k + 1).toString(),
        children: [
          {
            id: `group-k-1`,
            component: "Rectangle",
            parentId: (k + 2).toString() + `-Group-3`,
            layout: {
              x: 400,
              y: 0,
              width: 200,
              height: 200,
              rotate: 0,
              zIndex: 1,
              lock: false,
            },
            rotate: true,
            type: "component",
            relativeCanvas: (k + 1).toString(),
          },
          {
            id: `group-k-2`,
            component: "Rectangle",
            parentId: (k + 2).toString() + `-Group-3`,
            layout: {
              x: 200,
              y: 0,
              width: 200,
              height: 200,
              rotate: 0,
              zIndex: 1,
              lock: false,
            },
            rotate: true,
            type: "component",
            relativeCanvas: (k + 1).toString(),
          },
        ],
      },
    ],
  };
});
const store = reactive({
  nodes: arr as unknown as ZDragNodes[],
  components: [
    {
      id: `-kids`,
      component: "Rectangle",
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
      relativeCanvas: "canvas",
      rotate: true,
      type: "component",
    },
  ],
  canvas: {
    width: window.innerWidth,
    height: window.innerHeight,
    scale: 0.8,
    drag: false,
    scroll: {
      top: 0,
      left: 0,
    },
  },
  moving: false,
  active: undefined,
});
const option = {};
</script>
<template>
  <article>
    <ZDragEditor :option="option" class="editor" v-model="store"></ZDragEditor>
  </article>
</template>

<style scoped lang="scss">
//
.editor {
  width: 100vw;
  height: 100vh;
}
</style>
