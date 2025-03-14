<script setup lang="ts">
import { defineOptions, defineProps } from "vue";
defineOptions({
  name: "A4",
});
defineProps();
</script>
<template>
  <article class="A4"></article>
</template>
<style scoped lang="scss">
.A4 {
  width: 100%;
  height: 100%;
  background-color: white;
  border: 1px solid;
  // box-sizing: border-box;
  // box-shadow: 1px 1px 5px #cccccc;
}
</style>
