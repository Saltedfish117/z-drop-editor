<script setup lang="ts">
import { defineOptions, ref } from "vue";
import ZDragEditorCanvas from "../ZDragEditorCanvas/ZDragEditorCanvas.vue";
import ZToolbar from "../ZToolbar/ZToolbar.vue";
import ZDrag from "../ZDrag/ZDrag.vue";
defineOptions({
  name: "ZDragEditor",
});
const test = ref({
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  rotate: 0,
  zIndex: 1,
  lock: false,
});
const active = ref(true);
</script>
<template>
  <article class="ZDragEditor">
    <ZToolbar></ZToolbar>
    <ZDragEditorCanvas>
      <template #default="{ canvasSize }">
        <article
          class="page"
          :style="{
            transform: `translate(${canvasSize.width / 2 - 768 / 2}px,${
              canvasSize.height / 2 - 1243 / 2
            }px)`,
          }"
        >
          <ZDrag
            :position="'absolute'"
            v-model:active="active"
            v-model="test"
          ></ZDrag>
        </article>
      </template>
    </ZDragEditorCanvas>
  </article>
</template>
<style scoped lang="scss">
.ZDragEditor {
  // transform: scale(1);
  width: 100vw;
  height: 100vh;
  overflow: auto;
  box-sizing: border-box;
}
.page {
  position: absolute;
  top: 0;
  left: 0;
  height: 1123px;
  width: 794px;
  background-color: white;
}
</style>
