<script setup lang="ts">
import { defineOptions } from "vue";
import ZDragEditorCanvas from "../ZDragEditorCanvas/ZDragEditorCanvas.vue";
import ZToolbar from "../ZToolbar/ZToolbar.vue";
defineOptions({
  name: "ZDragEditor",
});
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
        ></article>
      </template>
    </ZDragEditorCanvas>
  </article>
</template>
<style scoped lang="scss">
.ZDragEditor {
  transform: scale(1);
  width: 100vw;
  height: 100vh;
  overflow: hidden;
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
