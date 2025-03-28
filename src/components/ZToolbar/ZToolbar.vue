<script setup lang="ts">
import { defineOptions } from "vue";
defineOptions({
  name: "ZToolbar",
});
</script>
<template>
  <header class="z-toolbar">
    <div class="z-toolbar-item z-toolbar-left">
      <slot name="left"></slot>
    </div>
    <div class="z-toolbar-item z-toolbar-center">
      <slot name="center"></slot>
    </div>
    <div class="z-toolbar-item z-toolbar-right">
      <slot name="right"></slot>
    </div>
  </header>
</template>
<style scoped lang="scss">
.z-toolbar {
  height: 50px;
  min-height: 50px;
  width: 100%;
  background-color: rgba(var(--z-page), 1);
  box-shadow: 1px 1px 5px rgba(var(--z-quiet), 1);
  border-bottom: 1px solid rgba(var(--z-quiet), 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 999;
  & > .z-toolbar-item {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .z-toolbar-left {
    justify-content: flex-start;
  }
  .z-toolbar-center {
    justify-content: center;
  }
  .z-toolbar-right {
    justify-content: flex-end;
  }
}
</style>
