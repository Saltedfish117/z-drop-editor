<script setup lang="ts">
import { defineOptions, defineModel, ref } from "vue";
import ZBtn from "../ZBtn/ZBtn.vue";
import ZTextField from "../ZTextField/ZTextField.vue";
import ZScaleController from "../ZScaleController/ZScaleController.vue";
defineOptions({
  name: "ZToolbar",
});
const scale = defineModel("scale", { type: Number, required: true });
const layout = defineModel("layout", {
  type: Object,
  required: true,
});
const setupOpen = ref(true);
const setupOpenChange = () => {
  setupOpen.value = !setupOpen.value;
};
</script>
<template>
  <header class="ZToolbar">
    <h1 class="ZToolbar-logo">ZDragEditor</h1>
    <div class="ZToolbar-end">
      <ZBtn
        @click="setupOpenChange"
        :padding="false"
        color="text-primary"
        class="ZToolbar-setup-icon"
      >
        <img src="../../assets/setup.svg" />
      </ZBtn>
      <ZScaleController v-model="scale"></ZScaleController>
    </div>
    <div
      :class="{
        open: setupOpen,
      }"
      class="ZToolbar-setup"
    >
      <div class="ZToolbar-setup-content">
        <div class="row">
          <ZTextField
            class="col"
            :model-value="layout.x"
            label="X"
            placeholder="x轴坐标"
            required
          />
          <ZTextField
            class="col"
            :model-value="layout.y"
            label="Y"
            placeholder="Y轴坐标"
            required
          />
          <ZTextField
            class="col"
            :model-value="layout.rotate"
            label="°"
            placeholder="Y轴坐标"
            required
          />
        </div>
        <div class="row">
          <ZTextField
            class="col"
            :model-value="layout.width"
            label="宽"
            placeholder="x轴坐标"
            required
          />
          <ZTextField
            class="col"
            :model-value="layout.height"
            label="高"
            placeholder="Y轴坐标"
            required
          />
        </div>
      </div>
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
      cursor: pointer;
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
    img {
      width: 20px;
      height: 20px;
      display: block;
      cursor: pointer;
    }
    position: relative;
  }
  .ZToolbar-setup {
    position: absolute;
    top: calc(100% + 1px);
    max-height: calc(100vh - 50px);
    right: 1px;
    width: 280px;
    background-color: #ffffff;
    // overflow: hidden;
    transition: all 0.3s ease;
    transform: scaleY(0);
    border-radius: 0 0 16px 16px;
    transform-origin: top center;
    .ZToolbar-setup-content {
      border-radius: 0 0 16px 16px;
      opacity: 0;
      transition: opacity 0.1s ease;
      padding: var(--z-size-sm);
      box-shadow: 1px 1px 5px rgba(var(--z-quiet), 0.5);
      .row {
        display: flex;
        align-items: center;
        margin-bottom: var(--z-size-sm);
        gap: var(--z-size-md);
      }
      .col {
        flex: 1;
      }
    }
  }
  .ZToolbar-setup.open {
    transform: scaleY(1);
    .ZToolbar-setup-content {
      // height: 300px;
      opacity: 1;
    }
  }
}
</style>
