<script setup lang="ts">
import {
  defineOptions,
  defineModel,
  defineEmits,
  computed,
  defineProps,
  defineExpose,
} from "vue";
import type { Layout, ZDragProps, MoveStart, Offset } from "./types";
import type { CSSProperties } from "vue";
defineOptions({
  name: "ZDrag",
});
const props = defineProps<ZDragProps>();
const emits = defineEmits([
  "update:active",
  "update:model",
  "before-move",
  "after-move",
  "moving",
]);
const resizes = [
  {
    direction: "n-resize",
    style: {
      left: "50%",
      top: 0,
      transform: "translate(-50%, -50%)",
      cursor: "n-resize",
    },
  },
  {
    direction: "s-resize",
    style: {
      left: "50%",
      bottom: 0,
      transform: "translate(-50%, 50%)",
      cursor: "s-resize",
    },
  },
  {
    direction: "e-resize",
    style: {
      right: 0,
      top: "50%",
      transform: "translate(50%, -50%)",
      cursor: "e-resize",
    },
  },
  {
    direction: "w-resize",
    style: {
      left: 0,
      top: "50%",
      transform: "translate(-50%, -50%)",
      cursor: "w-resize",
    },
  },
  {
    direction: "ne-resize",
    style: {
      right: 0,
      top: 0,
      transform: "translate(50%, -50%)",
      cursor: "ne-resize",
    },
  },
  {
    direction: "nw-resize",
    style: {
      left: 0,
      top: 0,
      transform: "translate(-50%, -50%)",
      cursor: "nw-resize",
    },
  },
  {
    direction: "se-resize",
    style: {
      right: 0,
      bottom: 0,
      transform: "translate(50%, 50%)",
      cursor: "se-resize",
    },
  },
  {
    direction: "sw-resize",
    style: {
      left: 0,
      bottom: 0,
      transform: "translate(-50%, 50%)",
      cursor: "sw-resize",
    },
  },
];
const resizeMove = {
  "n-resize": (offset: Offset, layout: Layout, start: MoveStart) => {
    if (start.height - offset.y < 0) {
      layout.y = start.layoutY + start.height;
      layout.height = 0;
    } else {
      layout.y = start.layoutY + offset.y;
      layout.height = start.height - offset.y;
    }
    return layout;
  },

  "e-resize": (offset: Offset, layout: Layout, start: MoveStart) => {
    if (start.width + offset.x < 0) {
      layout.width = 0;
    } else {
      layout.width = start.width + offset.x;
    }
    return layout;
  },
  "w-resize": (offset: Offset, layout: Layout, start: MoveStart) => {
    if (start.width - offset.x < 0) {
      layout.width = 0;
      layout.x = start.layoutX + start.width;
    } else if (start.layoutX - offset.x < 0) {
      layout.width = start.layoutX + start.width;
      layout.x = 0;
    } else {
      layout.width = start.width - offset.x;
      layout.x = start.layoutX + offset.x;
    }
    return layout;
  },
  "s-resize": (offset: Offset, layout: Layout, start: MoveStart) => {
    if (start.height + offset.y < 0) {
      layout.height = 0;
    } else {
      layout.height = start.height + offset.y;
    }

    return layout;
  },
  "ne-resize": (offset: Offset, layout: Layout, start: MoveStart) => {
    if (start.layoutY + offset.y < 0) {
      layout.y = 0;
      layout.height = start.height + start.layoutY;
    } else if (start.height - offset.y < 0) {
      layout.y = start.layoutY + start.height;
      layout.height = 0;
    } else {
      layout.y = start.layoutY + offset.y;
      layout.height = start.height - offset.y;
    }
    if (start.width + offset.x < 0) {
      layout.width = 0;
    } else {
      layout.width = start.width + offset.x;
    }
    return layout;
  },
  "se-resize": (offset: Offset, layout: Layout, start: MoveStart) => {
    layout.width = start.width + offset.x;
    layout.height = start.height + offset.y;
    if (layout.width <= 0) {
      layout.width = 0;
    }
    if (layout.height <= 0) {
      layout.height = 0;
    }
    return layout;
  },

  "sw-resize": (_: Offset, layout: Layout, start: MoveStart, e: MouseEvent) => {
    const scaleFactor = 1 / props.scale; // 计算缩放修正因子
    const correct = {
      x: (start.x - Number(e.clientX)) * scaleFactor,
      y: (start.y - Number(e.clientY)) * scaleFactor,
    };
    layout.width = start.width + correct.x;
    layout.height = start.height - correct.y;
    layout.x = start.layoutX - correct.x;
    if (layout.width < 0) {
      layout.width = 0;
      layout.x = start.layoutX + start.width;
    }
    if (layout.height < 0) {
      layout.height = 0;
    }
    return layout;
  },

  "nw-resize": (_: Offset, layout: Layout, start: MoveStart, e: MouseEvent) => {
    const scaleFactor = 1 / props.scale; // 计算缩放修正因子
    const correct = {
      x: (start.x - Number(e.clientX)) * scaleFactor,
      y: (start.y - Number(e.clientY)) * scaleFactor,
    };
    layout.width = start.width + correct.x;
    layout.height = start.height + correct.y;
    layout.x = start.layoutX - correct.x;
    layout.y = start.layoutY - correct.y;
    if (layout.height < 0) {
      layout.height = 0;
      layout.y = start.layoutY + start.height;
    }
    if (layout.width < 0) {
      layout.width = 0;
      layout.x = start.layoutX + start.width;
    }
    return layout;
  },
  move: (offset: Offset, layout: Layout, start: MoveStart) => {
    const resultX = start.layoutX + offset.x;
    const resultY = start.layoutY + offset.y;
    layout.x = resultX;
    layout.y = resultY;
    return layout;
  },
  rotate: (offset: Offset, layout: Layout, _: MoveStart) => {
    // const moveX = Number(e.clientX) - start.radiusX;
    // const moveY = Number(e.clientY) - start.radiusY;
    const angle = Math.atan2(offset.y, offset.x) * (180 / Math.PI);
    // 限制角度在 0 到 360 度之间
    layout.rotate = Math.round(((angle % 360) + 360) % 360);
    return layout;
  },
};
const mousedown = (e: MouseEvent, direction: keyof typeof resizeMove) => {
  if (model.value.lock) return;
  emits("before-move", e, direction);
  e.preventDefault();
  e.stopPropagation();
  const start: MoveStart = {
    x: Number(e.clientX),
    y: Number(e.clientY),
    layoutX: model.value.x,
    layoutY: model.value.y,
    width: model.value.width,
    height: model.value.height,
    rotate: model.value.rotate, // 旋转角度
    radiusX: Number(e.clientX),
    radiusY: Number(e.clientY),
    centerX: model.value.x + model.value.width / 2,
    centerY: model.value.y + model.value.height / 2,
  };
  let fist = true;
  document.documentElement.style.userSelect = "none";
  console.log("direction", direction);
  const move = (e: MouseEvent) => {
    if (fist) {
      fist = false;
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const scaleFactor = 1 / props.scale; // 计算缩放修正因子
    // 根据缩放倍率修正偏移量
    let offsetX = (e.clientX - start.x) * scaleFactor;
    let offsetY = (e.clientY - start.y) * scaleFactor;
    const offset = { x: offsetX, y: offsetY };
    document.documentElement.style.userSelect = "none";
    emits("moving", e, direction);
    model.value = resizeMove[direction](offset, { ...model.value }, start, e);
  };
  const up = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    emits("after-move", e, direction);
    document.documentElement.style.userSelect = "auto";
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", up);
  };
  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", up);
};
const model = defineModel<Layout>({
  type: Object,
  default: (): Layout => {
    return {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      zIndex: 1,
      rotate: 0,
      lock: false,
    };
  },
});
const active = defineModel<boolean>("active", {
  type: Boolean,
  default: false,
});
const style = computed((): CSSProperties => {
  return {
    position: props.position,
    transform: `translate(${model.value.x}px, ${model.value.y}px) rotate(${model.value.rotate}deg)`,
    zIndex: model.value.zIndex + 1,
    width: model.value.width + "px",
    height: model.value.height + "px",
  };
});
defineExpose({
  mousedown,
});
</script>
<template>
  <div
    @mousedown="mousedown($event, 'move')"
    class="ZDrag"
    :class="{
      active: active,
    }"
    :style="style"
  >
    <template v-if="!model.lock">
      <template v-if="!$slots.resizes">
        <div
          v-for="res in resizes"
          :key="res.direction"
          :style="res.style"
          :class="res.direction"
          @mousedown="
            mousedown($event, res.direction as keyof typeof resizeMove)
          "
        ></div>
      </template>
      <template v-else>
        <slot name="resizes" :active="active" :layout="model"></slot>
      </template>
    </template>
    <slot name="default" :active="active" :layout="model"></slot>
  </div>
</template>
<style scoped lang="scss">
.ZDrag {
  // // 定义resizes
  $resizes: (
    n-resize,
    s-resize,
    e-resize,
    w-resize,
    ne-resize,
    se-resize,
    sw-resize,
    nw-resize
  );
  // // 遍历resizes
  @each $res in $resizes {
    .#{$res} {
      position: absolute;
      width: 8px;
      height: 8px;
      background: rgba(var(--z-primary), 0.5);
      border: 1px solid rgba(var(--z-primary), 0.5);
      border-radius: 50%;
      z-index: 1;
    }
    .node.#{$res}:hover {
      border: 1px dashed rgba(var(--z-primary), 0.5);
    }
  }
}
.active {
  border: 1px solid rgba(var(--z-primary), 0.5);
}
</style>
