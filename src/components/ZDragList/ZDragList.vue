<script setup lang="ts">
import { defineOptions, defineProps, withDefaults } from "vue";
import { serializer } from "@/common/utils";
defineOptions({
  name: "ZDragList",
});
const props = withDefaults(
  defineProps<{
    type: string;
  }>(),
  {
    type: "json",
  }
);
const dragstart = (event: DragEvent, item: any) => {
  const dt = event.dataTransfer;
  if (!dt) return;
  dt.setData(props.type, serializer(item));
};
</script>
<template>
  <div>
    <slot :dragstart="dragstart" name="default"></slot>
  </div>
</template>
<style scoped lang="scss">
</style>
