<script setup lang="ts">
import { defineEmits, ref } from "vue";
import ZSvgIcon from "../ZSvgIcon/ZSvgIcon.vue";
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
  // value.value = val;
  emits("update:modelValue", val);
};
const handleFocus = () => {
  focus.value = true;
  // if (textFieldRef.value) textFieldRef.value.focus();
};
const handleBlur = () => {
  focus.value = false;
  // if (textFieldRef.value) textFieldRef.value.blur();
};
// const textFieldFocus = () => {
//   // focus.value = true;
//   console.log(111);
//   if (textFieldRef.value) textFieldRef.value.focus();
// };
// const textFieldBlur = () => {
//   // focus.value = false;
//   if (textFieldRef.value) textFieldRef.value.blur();
// };
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
        <ZSvgIcon v-if="prefixIcon" :name="prefixIcon" size="sm"></ZSvgIcon>
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
  .z-text-field-icon {
    min-width: 12px;
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
