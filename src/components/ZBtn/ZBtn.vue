<script setup lang="ts">
import { defineOptions } from "vue";
import type { ZBtnProps } from "./type";

defineOptions({
  name: "ZBtn",
});

const props = withDefaults(defineProps<ZBtnProps>(), {
  color: "primary",
  plain: false,
  round: false,
  disabled: false,
  padding: true,
});
</script>

<template>
  <button
    class="ZBtn"
    :class="[
      `z-btn-${color}`,
      { 'is-plain': plain },
      { 'is-round': round },
      { 'is-disabled': disabled },
      { 'is-padding': padding },
    ]"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
.ZBtn {
  position: relative;
  border: 1px solid rgba(var(--z-primary), 0.8);
  border-radius: 4px;
  background-color: rgba(var(--z-primary), 0.8);
  color: white;
  cursor: pointer;
  transition: all 0.1s;
  outline: none;
  padding: 0;
  transform-origin: center;
  &.is-round {
    border-radius: 24px;
  }
  &.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  &.is-padding {
    padding: 4px 8px;
  }
  // 交互效果
  &:not(.is-disabled):hover {
    opacity: 0.9;
    transform: scale(1.05);
  }
  &:not(.is-disabled):active {
    transform: scale(0.95);
  }
}
// 颜色扩展
@each $color in primary, success, danger, warning, info, dark {
  .z-btn-#{$color} {
    border-color: rgba(var(--z-#{$color}), 0.8);
    background-color: rgba(var(--z-#{$color}), 0.8);
    &.is-plain {
      color: rgba(var(--z-#{$color}), 0.8);
      background-color: transparent;
    }
  }
  .z-btn-link-#{$color} {
    border: none;
    background-color: transparent;
    color: rgba(var(--z-#{$color}), 0.8);
    position: relative;
    &::after {
      position: absolute;
      content: "";
      display: block;
      width: 0%;
      transition: width 0.3s ease-in-out;
      bottom: 0;
      height: 1px;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(var(--z-#{$color}), 0.6);
    }
    &:not(.is-disabled):hover::after {
      width: 100%;
    }
  }
  .z-btn-text-#{$color} {
    border: none;
    background-color: transparent;
    color: rgba(var(--z-#{$color}), 0.8);
    border: 1px solid transparent;
  }
}
// 特殊颜色处理
.z-btn-light {
  border-color: #f5f5f5;
  background-color: #f5f5f5;
  color: var(--z-dark);
  &.is-plain {
    color: var(--z-dark);
    background-color: transparent;
  }
}
</style>
