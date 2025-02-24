<script setup lang="ts">
import { defineOptions } from "vue";
import ZDragEditorContent from "../ZDragEditorContent/ZDragEditorContent.vue";
import ZToolbar from "../ZToolbar/ZToolbar.vue";
defineOptions({
  name: "ZDragEditor",
});
</script>
<template>
  <article class="ZDragEditor">
    <ZToolbar></ZToolbar>
    <ZDragEditorContent></ZDragEditorContent>
  </article>
</template>
<style scoped lang="scss">
.ZDragEditor {
  transform: scale(1);
  background-color: gainsboro;
  width: 100vw;
  height: 100vh;

  overflow: hidden;
  box-sizing: border-box;
}
</style>
