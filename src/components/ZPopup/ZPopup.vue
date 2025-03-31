<script setup lang="ts">
import { defineOptions, ref, computed, onBeforeUnmount, onMounted } from "vue";
defineOptions({
  name: "ZPopup",
});
const props = defineProps<{
  contextMenu?: boolean;
}>();
const popupRef = ref<HTMLElement | null>(null);
const popupContentRef = ref<HTMLElement | null>(null);
const visible = ref<boolean>(false);
const axis = ref({
  x: 0,
  y: 0,
});
const parent = computed(() => {
  if (!popupRef.value) return null;
  return popupRef.value.parentElement;
});
const close = () => {
  visible.value = false;
};
// const open = () => {
//   visible.value = true;
// };
const visibleChange = () => (visible.value = !visible.value);
const event = computed(() => {
  return props.contextMenu ? "contextmenu" : "click";
});
const parentRect = computed(() => {
  if (!parent.value) return {} as DOMRect;
  return parent.value.getBoundingClientRect();
});
// const popupContentRect = computed(() => {
//   if (!popupContentRef.value) return {} as DOMRect;
//   return popupContentRef.value.getBoundingClientRect();
// });
popupContentRef;
const handleClickOutside = (e: MouseEvent) => {
  if (!popupContentRef.value) return;
  if (!popupContentRef.value.contains(e.target as Node)) {
    close();
  }
};
const handleClick = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  axis.value = {
    x: parentRect.value.x + parentRect.value.width,
    y: parentRect.value.y + parentRect.value.height,
  };
  visibleChange();
};
onMounted(() => {
  if (!parent.value) return;
  parent.value.addEventListener(event.value, handleClick);
  document.documentElement.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  if (!parent.value) return;
  parent.value.removeEventListener(event.value, handleClick);
});
</script>
<template>
  <div ref="popupRef"></div>
  <Teleport to="body">
    <div
      :style="{
        left: `${axis.x}px`,
        top: `${axis.y}px`,
      }"
      ref="popupContentRef"
      v-show="visible"
      class="z-popup"
    >
      <slot :close="close"></slot>
    </div>
  </Teleport>
</template>
<style scoped lang="scss">
.z-popup {
  position: fixed;
  background-color: rgb(var(--z-page));
  padding: 4px 8px;
  border-radius: 4px;
  box-shadow: 0px 3px 6px rgba(64, 87, 109, 0.1);
  z-index: 9999;
}
</style>
