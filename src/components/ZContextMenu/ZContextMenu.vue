<script setup lang="ts">
import { ref, onMounted, onUnmounted, getCurrentInstance, computed } from "vue";
import ZSvgIcon from "../ZSvgIcon/ZSvgIcon.vue";
interface MenuItem {
  label: string;
  action: (context?: any) => void;
  icon?: any;
  disabled?: boolean;
  divider?: boolean;
}
const props = defineProps({
  menuItems: {
    type: Array as () => MenuItem[],
    required: true,
  },
});
const menuRef = ref<HTMLElement | null>(null);
const visible = ref(false);
const x = ref(0);
const y = ref(0);
const showMenu = (position: { clientX: number; clientY: number }) => {
  visible.value = true;
  x.value = position.clientX;
  y.value = position.clientY;
};
const handleContextMenu = (e: Event) => {
  e.preventDefault();
  showMenu(e as MouseEvent);
};
const handleMenuItemClick = (item: MenuItem) => {
  if (item.disabled) return;
  item.action(item);
  closeMenu();
};

const closeMenu = () => {
  visible.value = false;
};

const handleClickOutside = (e: Event) => {
  const target =
    e instanceof MouseEvent
      ? e.target
      : (e as TouchEvent).targetTouches[0].target;
  const menuEl = document.querySelector(".context-menu");
  if (menuEl && !menuEl.contains(target as Node)) {
    closeMenu();
  }
};
const parent = computed(() => {
  if (!menuRef.value) return document;
  else
    return menuRef.value.parentElement ? menuRef.value.parentElement : document;
});
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
    class="context-menu"
    :style="{ left: x + 'px', top: y + 'px' }"
    @click.stop="closeMenu"
    ref="menuRef"
  >
    <template v-if="!$slots.default">
      <div
        v-for="(item, index) in menuItems"
        :key="index"
        class="menu-item"
        :class="{ disabled: item.disabled }"
        :tabindex="index"
        @click="handleMenuItemClick(item)"
      >
        <ZSvgIcon v-if="item.icon" :name="item.icon" class="menu-icon" />
        <span class="menu-text">{{ item.label }}</span>
      </div>
    </template>
    <slot
      :closeMenu="closeMenu"
      :handleMenuItemClick="handleMenuItemClick"
      :menuItems="menuItems"
      name="default"
    ></slot>
  </div>
</template>

<style scoped lang="scss">
.context-menu {
  position: fixed;
  z-index: 9999;
  min-width: 160px;
  padding: 8px;
  border-radius: 8px;
  background: rgba(var(--z-page), 0.9);
  box-shadow: 0px 4px 10px 0px rgba(var(--z-quiet), 0.6);
  //   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(var(--z-quiet), 0.6);
  backdrop-filter: blur(8px);
  &.touch-device {
    min-width: 200px;
    padding: 12px;
    border-radius: 12px;
  }
}

.menu-item {
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(var(--z-text), 0.9);
  transition: all 0.2s ease;

  &:hover:not(.disabled) {
    background: rgba(var(--z-primary), 0.1);
    color: rgba(var(--z-primary), 1);
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.menu-icon {
  width: 16px;
  height: 16px;
}

.menu-text {
  font-size: 14px;
  font-family: system-ui;
}
</style>
