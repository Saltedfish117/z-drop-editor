<script setup lang="ts">
import { defineOptions, defineModel } from "vue";
import ZBtn from "../ZBtn/ZBtn.vue";
defineOptions({
  name: "ZScaleController",
});
const scale = defineModel({
  required: true,
  type: Number,
});
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
  <div class="ZScaleController">
    <ZBtn color="text-primary" @click="adjustScale(0.1)">+</ZBtn>
    <input
      class="ZScaleController-value"
      @change="changeScale"
      :value="scale * 100"
    />
    <ZBtn color="text-primary" @click="adjustScale(-0.1)">-</ZBtn>
  </div>
</template>
<style scoped lang="scss">
.ZScaleController {
  margin: 0 20px;
  display: flex;
  align-items: center;
  .ZScaleController-value {
    width: 20px;
    outline: none;
    border-radius: 4px;
    border-width: 1px;
    border-color: rgba(var(--z-quiet), 1);
    border-style: solid;
    padding: 4px 8px;
    margin: 0 8px;
    font-size: var(--z-font-xs);
    &:hover {
      border-color: rgba(var(--z-primary), 1);
    }
    &:focus {
      border-color: rgba(var(--z-primary), 1);
    }
  }
}
</style>
