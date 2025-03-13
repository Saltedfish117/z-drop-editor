<script setup lang="ts">
import { defineOptions, defineModel } from "vue";
import type { ZDragEditorModel } from "../ZDragEditor/types";
defineOptions({
  name: "ZToolbar",
});
const store = defineModel<ZDragEditorModel>("store", { required: true });
</script>
<template>
  <header class="ZToolbar">
    <div class="ZToolbar-item ZToolbar-left">
      <template v-if="!$slots['left']"> </template>
      <slot :store="store" name="left"></slot>
    </div>
    <div class="ZToolbar-item ZToolbar-center">
      <template v-if="!$slots['center']"> </template>
      <slot :store="store" name="center"></slot>
    </div>
    <div class="ZToolbar-item ZToolbar-right">
      <template v-if="!$slots['right']"> </template>
      <slot :store="store" name="right"></slot>
    </div>
  </header>
</template>
<style scoped lang="scss">
.ZToolbar {
  position: relative;
  height: 50px;
  max-height: 120px;
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 1px 1px 5px rgba(204, 197, 197, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 2;

  & > .ZToolbar-item {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .ZToolbar-left {
    justify-content: flex-start;
  }
  .ZToolbar-center {
    justify-content: center;
  }
  .ZToolbar-right {
    justify-content: flex-end;
  }
}
</style>
