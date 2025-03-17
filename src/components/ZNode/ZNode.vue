<script setup lang="ts">
import { defineOptions, computed } from "vue";
import type { ZNode } from "./types";
import type { CSSProperties } from "vue";
defineOptions({
  name: "ZNode",
});
const node = defineModel<ZNode>({
  required: true,
});
const style = computed<CSSProperties>(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: `${node.value.layout.width}px`,
  height: `${node.value.layout.height}px`,
  transform: `translate(${node.value.layout.x}px,${node.value.layout.y}px) rotate(${node.value.layout.rotate}deg)`,
}));
</script>
<template>
  <!-- <div> -->
  <!-- <div> -->
  <!-- <div>
    <div :style="style" class="ZNode"></div>
  </div> -->
  <component
    :style="style"
    v-bind="$attrs"
    :is="node.component"
    v-model="node"
    class="ZNode"
  ></component>

  <!-- </div> -->
  <!-- </div> -->
</template>
<style scoped lang="scss">
//    class="ZNode-content"
.ZNode {
  box-sizing: border-box;
  // position: absolute;
  // top: 0;
  // left: 0;
  // &:hover {
  //   background: linear-gradient(
  //         to left,
  //         rgb(var(--z-primary)),
  //         rgb(var(--z-primary))
  //       )
  //       no-repeat,
  //     linear-gradient(to bottom, rgb(var(--z-primary)), rgb(var(--z-primary)))
  //       left top no-repeat,
  //     linear-gradient(to right, rgb(var(--z-primary)), rgb(var(--z-primary)))
  //       right bottom no-repeat,
  //     linear-gradient(to bottom, rgb(var(--z-primary)), rgb(var(--z-primary)))
  //       right top no-repeat;
  //   background-size: 100% 3px, 3px 100%, 100% 3px, 3px 100%;
  //   background-clip: border-box;
  // }
  // .ZNode-content {
  //   width: 100%;
  //   height: 100%;
  //   box-sizing: border-box;
  // }
}
</style>
