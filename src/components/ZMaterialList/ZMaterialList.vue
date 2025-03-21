<script setup lang="ts">
import { defineOptions, defineProps } from "vue";
import { serializer } from "@/common/utils";
import type { ZDragNode, ZDragNodes } from "@/common/type";
defineOptions({
  name: "ZMaterialList",
});
defineProps<{
  components: ZDragNodes;
}>();
const dragMenuItemDrag = (event: DragEvent, node: ZDragNode) => {
  if (!event || !event.dataTransfer) return;
  let dt = event.dataTransfer;
  dt.setData("json", serializer.serialize(node));
};
</script>
<template>
  <ul class="z-drag-component-menu">
    <li
      draggable="true"
      v-for="(com, i) in components"
      @dragstart="dragMenuItemDrag($event, com)"
      :tabindex="-i"
      :key="com.id"
      class="z-drag-component-menu-item"
    >
      <span>
        {{ com.label }}
      </span>
    </li>
  </ul>
</template>
<style scoped lang="scss">
.z-drag-component-menu {
  margin: 0;
  list-style: none;
  padding: 4px 8px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  .z-page-menu-container {
    height: 50%;
    max-height: 50%;
  }
  .z-drag-component-menu-item {
    min-width: 50px;
    width: 70px;
    min-height: 50px;
    height: 70px;
    border: 1px solid rgb(var(--z-quiet));
    border-radius: 8px;
    background-color: rgba(var(--z-quiet), 0.3);
    transition: all 0.15s ease;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    &:hover {
      cursor: grab;
      background-color: rgba(var(--z-quiet), 0.6);
      border-color: rgba(var(--z-primary), 0.6);
      color: rgba(var(--z-primary), 0.6);
    }
    &:active {
      cursor: grabbing;
      background-color: rgba(var(--z-quiet), 1);
      border-color: rgba(var(--z-primary), 1);
      color: rgba(var(--z-primary), 1);
      user-select: none;
    }
  }
}
</style>
