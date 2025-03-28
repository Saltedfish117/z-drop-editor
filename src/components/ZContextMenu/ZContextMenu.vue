<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, defineProps, withDefaults } from "vue";
import type { ZContextMenuProps } from "./type";
withDefaults(defineProps<ZContextMenuProps>(), {
  clickClose: true,
});
const menuRef = ref<HTMLElement | null>(null);
const parent = computed(() => {
  if (!menuRef.value) return document.documentElement;
  else
    return menuRef.value.parentElement
      ? menuRef.value.parentElement
      : document.documentElement;
});
const visible = ref(false);
const x = ref(0);
const y = ref(0);
const showMenu = (position: { clientX: number; clientY: number }) => {
  visible.value = true;
  if (!menuRef.value) return;
  if (!parent.value) return;
  const clientWidth = parent.value.clientWidth;
  const clientHeight = parent.value.clientHeight;
  if (position.clientX + menuRef.value.clientWidth > clientWidth) {
    x.value = position.clientX - menuRef.value.clientWidth;
  } else {
    x.value = position.clientX;
  }
  if (position.clientY + menuRef.value.clientHeight > clientHeight) {
    y.value = position.clientY - menuRef.value.clientHeight;
  } else {
    y.value = position.clientY;
  }
};
const handleContextMenu = (e: Event) => {
  e.preventDefault();
  showMenu(e as MouseEvent);
};
const closeMenu = () => {
  visible.value = false;
};
// const handleClickClose = () => {
// 	if (props.clickClose) {
// 		closeMenu();
// 	}
// };
const handleClickOutside = (e: Event) => {
  if (!menuRef.value) return;
  e.preventDefault();
  e.stopPropagation();
  if (!menuRef.value.contains(e.target as Node)) {
    closeMenu();
  }
  // const target =
  //   e instanceof MouseEvent
  //     ? e.target
  //     : (e as TouchEvent).targetTouches[0].target;
  // const menuEl = document.querySelector(".context-menu");
  // if (menuEl && !menuEl.contains(target as Node)) {
  //   closeMenu();
  // }
};
onMounted(() => {
  parent.value.addEventListener("contextmenu", handleContextMenu);
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("scroll", closeMenu);
});
onUnmounted(() => {
  const events = ["contextmenu", "click"];
  events.forEach((event) => {
    parent.value.removeEventListener(event, handleContextMenu);
    document.removeEventListener(event, handleClickOutside);
  });
  document.removeEventListener("scroll", closeMenu);
});
</script>
<template>
  <div
    v-show="visible"
    class="z-context-menu"
    :style="{ left: x + 'px', top: y + 'px' }"
    ref="menuRef"
  >
    <slot :closeMenu="closeMenu" name="default"></slot>
  </div>
</template>

<style scoped lang="scss">
.z-context-menu {
  position: fixed;
  z-index: 9999;
}
</style>
