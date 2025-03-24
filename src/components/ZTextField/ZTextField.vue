<script setup lang="ts">
import { defineModel, ref } from "vue";
import ZSvgIcon from "../ZSvgIcon/ZSvgIcon.vue";
import type { ZTextFieldProps } from "./type";
defineOptions({ name: "ZTextField" });
const props = withDefaults(defineProps<ZTextFieldProps>(), {
  placeholder: "",
  disabled: false,
});
const value = defineModel();
const focus = ref(false);
const handleInput = (event: Event) => {
  if (props.disabled) return;
  const val = (event.target as HTMLInputElement).value;
  value.value = val;
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
    <template v-if="!$slots.prefix"
      ><div v-if="prefixIcon">
        <ZSvgIcon :name="prefixIcon" size="sm"></ZSvgIcon>
      </div>
    </template>
    <slot name="prefix"></slot>
    <input
      class="z-text-field-input"
      @input="handleInput"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
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
  padding: 4px 8px;
  gap: 8px;
  color: rgb(var(--z-text));
  font-size: var(--font-sm);
  &.focus {
    border: 1px solid rgb(var(--z-primary));
  }
  .z-text-field-input {
    flex: 1;
    outline: none;
    border: none;
    height: 100%;
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
