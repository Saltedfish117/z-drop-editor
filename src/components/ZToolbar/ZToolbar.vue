<script setup lang="ts">
import { defineOptions, defineModel } from "vue";
import ZBtn from "../ZBtn/ZBtn.vue";
defineOptions({
  name: "ZToolbar",
});
const scale = defineModel("scale", { type: Number, default: 1 });
const changeScale = (e: Event) => {
  const value = parseFloat((e.target as HTMLInputElement).value) / 100;
  if (!Number.isNaN(value) && value >= 0.1 && value <= 5) {
    scale.value = Number(value.toFixed(2));
  } else {
    (e.target as HTMLInputElement).value = (scale.value * 100).toString();
  }
};
const adjustScale = (delta: number) => {
  scale.value = Math.min(
    5,
    Math.max(0.1, Number((scale.value + delta).toFixed(2)))
  );
};
</script>
<template>
  <header class="ZToolbar">
    <h1 class="ZToolbar-logo">ZDragEditor</h1>
    <div class="ZToolbar-scale">
      <ZBtn color="text-primary" @click="adjustScale(0.1)">+</ZBtn>
      <input
        class="ZToolbar-scale-value"
        @change="changeScale"
        :value="scale * 100"
      />
      <ZBtn color="text-primary" @click="adjustScale(-0.1)">-</ZBtn>
    </div>
  </header>
</template>
<style scoped lang="scss">
.ZToolbar {
  position: fixed;
  top: 0;
  min-height: 50px;
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 1px 1px 5px rgba(204, 197, 197, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
  .ZToolbar-logo {
    margin: 0;
    font-size: var(--z-font-xl);
    padding: 4px 8px;
    &:hover {
      color: rgba(var(--z-primary), 1);
    }
  }
  .ZToolbar-scale {
    margin: 0 20px;
    display: flex;
    align-items: center;
    .ZToolbar-scale-value {
      width: 20px;
      outline: none;
      border-radius: 4px;
      border-width: 1px;
      border-color: rgba(var(--z-quiet), 1);
      border-style: solid;
      padding: 4px 8px;
      margin: 0 8px;
      font-size: var(--z-font-xs);
      // color: rgba(var(--z-quiet), 1);
      &:hover {
        border-color: rgba(var(--z-primary), 1);
      }
      &:focus {
        border-color: rgba(var(--z-primary), 1);
      }
    }
  }
}
</style>
