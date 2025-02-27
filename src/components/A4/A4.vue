<script setup lang="ts">
import { defineOptions, defineProps } from "vue";
defineOptions({
  name: "A4",
});
defineProps({
  canvasSize: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <article class="A4"></article>
</template>
<style scoped lang="scss">
.A4 {
  width: 100%;
  height: 100%;
  background-color: white;
  box-shadow: 1px 1px 5px #cccccc;
}
</style>
