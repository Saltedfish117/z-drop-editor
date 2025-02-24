<script setup lang="ts">
import { defineOptions } from "vue";
defineOptions({
  name: "ZToolbar",
});
</script>
<template>
  <header class="ZToolbar"></header>
</template>
<style scoped lang="scss">
.ZToolbar {
  position: fixed;
  top: 0;
  height: 50px;
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 1px 1px 5px rgba(204, 197, 197, 0.5);
  z-index: 2;
}
</style>
