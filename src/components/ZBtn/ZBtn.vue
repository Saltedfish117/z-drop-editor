<script setup lang="ts">
import { defineOptions } from "vue";
import type { ZBtnProps } from "./type";

defineOptions({
  name: "ZBtn",
});

const props = withDefaults(defineProps<ZBtnProps>(), {
  color: "default",
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
  border: 1px solid rgba(var(--z-quiet), 0.8);
  border-radius: 4px;
  color: var(--z-text);
  background-color: transparent;
  cursor: pointer;
  transition: all 0.15s;
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
  } // 交互效果
  &:not(.is-disabled):hover {
    opacity: 0.9;
    transform: scale(1.05);
  }
  &:not(.is-disabled):active {
    transform: scale(0.95);
  }
}
.z-btn-default {
  &:not(.is-disabled):hover {
    border: 1px solid rgba(var(--z-primary), 0.8);
    color: rgba(var(--z-primary), 1);
  }
}
.z-btn-text-default {
  border: none;
  background-color: transparent;
  color: rgba(var(--z-text), 1);
  border: 1px solid transparent;
  &:not(.is-disabled):hover {
    color: rgba(var(--z-primary), 1);
  }
}
.z-btn-link-default {
  border: none;
  color: rgba(var(--z-text), 1);
  transition: background-size 1s, transform 0.15s, opacity 0.15s;
  position: relative;
  background: linear-gradient(to right, rgb(var(--z-text)), rgb(var(--z-text)))
    no-repeat right bottom;
  background-size: 0 1px;
  &:not(.is-disabled):hover {
    background-position: left bottom;
    background-size: 100% 1px;
  }
}
// 颜色扩展
@each $color in primary, success, danger, warning, info {
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
    color: rgba(var(--z-#{$color}), 1);
    position: relative;
    background: linear-gradient(
        to right,
        rgb(var(--z-#{$color})),
        rgb(var(--z-#{$color}))
      )
      no-repeat
      right
      bottom;
    background-size: 0 1px;
    &:not(.is-disabled):hover {
      background-position: left bottom;
      background-size: 100% 1px;
    }
  }
  .z-btn-text-#{$color} {
    border: none;
    background-color: transparent;
    color: rgba(var(--z-#{$color}), 0.8);
    border: 1px solid transparent;
  }
}
</style>
