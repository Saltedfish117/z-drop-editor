<script setup lang="ts">
import { defineOptions, ref, watch, onUnmounted, computed } from "vue";
defineOptions({
  name: "ZArea",
});
const style = ref({
  width: 0,
  height: 0,
  x: 0,
  y: 0,
});
const props = defineProps<{
  wrapper: HTMLElement | null;
  canvas: HTMLElement | null;
}>();
const mousedown = (event: MouseEvent) => {
  if (!props.wrapper || !props.canvas) return;
  const { clientX, clientY } = event;
  const { left, top } = props.canvas.getBoundingClientRect();
  const x = clientX - left;
  const y = clientY - top;
  let start = {
    width: 0,
    height: 0,
    x,
    y,
  };
  console.log("sss");
  style.value = { ...start };
  const mousemove = (event: MouseEvent) => {
    if (!props.wrapper || !props.canvas) return;
    const { clientX, clientY } = event;
    const { left, top } = props.canvas.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    const width = x - start.x;
    const height = y - start.y;
    style.value = {
      width,
      height,
      x: start.x,
      y: start.y,
    };
  };
  const mouseup = () => {
    props.wrapper?.removeEventListener("mousemove", mousemove);
    props.wrapper?.removeEventListener("mouseup", mouseup);
  };
  props.wrapper.addEventListener("mousemove", mousemove);
  props.wrapper.addEventListener("mouseup", mouseup);
};
watch(
  () => props.wrapper,
  (_, old) => {
    if (!props.wrapper) return;
    if (old) {
      old.removeEventListener("mousedown", mousedown);
    }
    console.log(_, old);
    props.wrapper.addEventListener("mousedown", mousedown);
  }
);
onUnmounted(() => {
  if (!props.wrapper) return;
  props.wrapper.removeEventListener("mousedown", mousedown);
});
const withStyle = computed(() => {
  return {
    width: `${style.value.width}px`,
    height: `${style.value.height}px`,
    transform: `translate(${style.value.x}px, ${style.value.y}px
  `,
  };
});
</script>
<template>
  <div :style="withStyle" class="z-area"></div>
</template>
<style scoped lang="scss">
.z-area {
  border: 1px solid rgb(var(--z-primary));
}
</style>
