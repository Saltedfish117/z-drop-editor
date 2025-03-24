<script setup lang="ts">
import { ref, computed, defineModel } from "vue";
import type { ZTextFieldProps } from "./type";
defineOptions({ name: "ZTextField" });
withDefaults(defineProps<ZTextFieldProps>(), {
  label: "",
  placeholder: "",
  error: "",
  disabled: false,
  required: false,
});
const model = defineModel();
const isFocused = ref(false);
const showFloatingLabel = computed(
  () => isFocused.value || typeof model.value !== undefined
);
const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  model.value = value;
};
const handleBlur = (event: Event) => {
  isFocused.value = false;
};
const handleFocus = (event: Event) => {
  isFocused.value = true;
};
</script>
<template>
  <div class="ZTextField" :class="{ 'is-disabled': disabled }">
    <div class="text-field-container">
      <input
        :id="label"
        :value="modelValue"
        :placeholder="showFloatingLabel ? '' : placeholder"
        :disabled="disabled"
        class="text-input"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />

      <label
        v-if="label"
        :for="label"
        class="floating-label"
        :class="{ 'label-active': showFloatingLabel }"
      >
        {{ label }}
      </label>
      <div class="underline" :class="{ 'underline-active': isFocused }"></div>
    </div>
    <transition name="fade">
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.ZTextField {
  position: relative;
  margin: 1.5rem 0;

  .text-field-container {
    position: relative;
    padding-top: 8px;

    .text-input {
      width: 100%;
      border: none;
      outline: none;
      padding: 8px 0;
      font-size: var(--z-font-md);
      background: transparent;
      color: var(--z-light-text);
      caret-color: rgba(var(--z-primary), 1);
      border-bottom: 1px solid rgba(var(--z-quiet), 1);
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .floating-label {
      position: absolute;
      left: 0;
      top: 16px;
      font-size: var(--z-font-md);
      color: rgba(var(--z-quiet), 1);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;

      &.label-active {
        top: -4px;
        font-size: var(--z-font-xs);
        color: rgba(var(--z-primary), 1);
      }
    }

    .underline {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 1px;
      transform: translateX(-50%);
      background-color: rgba(var(--z-quiet), 1);
      transition: all 0.3s ease;
      &-active {
        height: 2px;
        width: 100%;
        background-color: rgba(var(--z-primary), 1);
      }
    }
  }

  .error-message {
    position: absolute;
    font-size: var(--z-font-xs);
    color: rgba(var(--z-danger), 1);
    margin-top: 4px;
  }

  &.is-disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
