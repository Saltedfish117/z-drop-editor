<script setup lang="ts">
import { defineOptions, defineModel, ref } from "vue";
import ZBtn from "../ZBtn/ZBtn.vue";
defineOptions({
  name: "ZToolbar",
});
const scale = defineModel("scale", { type: Number, default: 1 });
const layout = defineModel("layout", {
  type: Object,
  required: true,
});
const setupOpen = ref(true);
const setupOpenChange = () => {
  setupOpen.value = !setupOpen.value;
};
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
    <div class="ZToolbar-end">
      <img
        @click="setupOpenChange"
        class="ZToolbar-setup-icon"
        src="../../assets/setup.svg"
      />
      <div class="ZToolbar-scale">
        <ZBtn color="text-primary" @click="adjustScale(0.1)">+</ZBtn>
        <input
          class="ZToolbar-scale-value"
          @change="changeScale"
          :value="scale * 100"
        />
        <ZBtn color="text-primary" @click="adjustScale(-0.1)">-</ZBtn>
      </div>
    </div>
    <div
      :class="{
        open: setupOpen,
      }"
      class="ZToolbar-setup"
    >
      <div class="ZToolbar-setup-content"></div>
    </div>
  </header>
</template>
<style scoped lang="scss">
.ZToolbar {
  position: fixed;
  top: 0;
  height: 50px;
  max-height: 120px;
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 1px 1px 5px rgba(204, 197, 197, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
  .ZToolbar-end {
    display: flex;
    align-items: center;
  }
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
  .ZToolbar-setup-icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .ZToolbar-setup {
    position: absolute;
    top: calc(100% + 1px);
    height: calc(100vh - 50px);
    max-height: calc(100vh - 50px);
    right: 0px;
    min-width: 280px;
    background-color: #ffffff;
    transition: all 0.3s ease;
    transform: scaleX(0);
    transform-origin: right center;
    .ZToolbar-setup-content {
      height: 300px;
    }
  }
  .ZToolbar-setup.open {
    transform: scaleX(1);
  }
}
</style>
