<script setup lang="ts">
import { defineEmits, ref } from "vue";
import ZIcon from "../ZIcon/ZIcon.vue";
import type { ZTextFieldProps } from "./type";
defineOptions({ name: "ZTextField" });
const props = withDefaults(defineProps<ZTextFieldProps>(), {
  placeholder: "",
  modelValue: "",
  disabled: false,
});
const emits = defineEmits(["update:modelValue"]);
const focus = ref(false);
const textFieldRef = ref<HTMLElement | null>(null);
const handleInput = (event: Event) => {
  event.preventDefault();
  if (props.disabled) return;
  const val = (event.target as HTMLInputElement).value;
  emits("update:modelValue", val);
};
const handleFocus = () => {
  focus.value = true;
};
const handleBlur = () => {
  focus.value = false;
};
</script>
<template>
  <div
    tabindex="-1"
    class="z-text-field"
    :disabled="disabled"
    :class="{ disabled: disabled, focus: focus }"
  >
    <div v-if="$slots.prefix || prefixIcon" class="z-text-field-icon">
      <template v-if="!$slots.prefix">
        <ZIcon v-if="prefixIcon" :name="prefixIcon" size="sm"></ZIcon>
      </template>
      <slot name="prefix"></slot>
    </div>
    <input
      v-bind="$attrs"
      ref="textFieldRef"
      class="z-text-field-input"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </div>
</template>

<style scoped lang="scss">
.z-text-field {
  position: relative;
  display: flex;
  border: 1px solid rgb(var(--z-quiet));
  border-radius: 4px;
  align-items: center;
  overflow: hidden;
  padding: 4px 8px;
  gap: 4px;
  color: rgb(var(--z-text));
  &.focus {
    border: 1px solid rgb(var(--z-primary));
    .z-text-field-icon {
      color: rgb(var(--z-primary));
    }
  }
  &:not(disabled) {
    &:not(.focus) {
      &:hover {
        border: 1px solid rgba(var(--z-primary), 0.3);
        // .z-text-field-icon {
        //   color: rgb(var(--z-primary), 0.3);
        // }
      }
    }
  }
  .z-text-field-icon {
    min-width: 12px;
    font-size: inherit;
  }
  .z-text-field-input {
    flex: 1;
    outline: none;
    border: none;
    height: 100%;
    width: calc(100% - 40px);
    &[disabled] {
      cursor: not-allowed;
    }
  }
  &.disabled {
    color: rgb(var(--z-quiet));
    cursor: not-allowed;
  }
}
</style>
