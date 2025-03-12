<script setup lang="ts">
import ZDragEditor from "./components/ZDragEditor/ZDragEditor.vue";

import { reactive } from "vue";
let arr = Array.from({ length: 5 }, (_, k) => {
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
    children: [
      {
        id: (k + 1).toString() + `-kids`,
        component: "a4",
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
      },
      {
        id: (k + 2).toString() + `-kids-3`,
        component: "a4",
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
      },
    ],
  };
});
const store = reactive({
  nodes: arr,
  components: [
    {
      id: "page",
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
    },
  ],
  canvas: {
    width: window.innerWidth,
    height: window.innerHeight,
    scale: 0.8,
  },
  moving: false,
  active: undefined,
});
</script>
<template>
  <article>
    <ZDragEditor class="editor" v-model="store"></ZDragEditor>
  </article>
</template>

<style scoped lang="scss">
//
.editor {
  width: 100vw;
  height: 100vh;
}
</style>
