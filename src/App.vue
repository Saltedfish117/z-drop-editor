<script setup lang="ts">
import ZDragEditor from "./components/ZDragEditor/ZDragEditor.vue";

import { reactive } from "vue";
let arr = Array.from({ length: 5 }, (_, k) => {
  return {
    id: (k + 1).toString(),
    component: "a4",
    layout: {
      x: 0,
      y: 0,
      width: 794,
      height: 1123,
      rotate: 0,
      zIndex: 1,
      lock: false,
    },
  };
});
const store = reactive({
  nodes: arr,
  components: [
    {
      id: "a4",
      component: "a4",
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
  active: null,
});
</script>
<template>
  <article>
    <ZDragEditor v-model="store"></ZDragEditor>
  </article>
</template>

<style scoped lang="scss">
//
</style>
