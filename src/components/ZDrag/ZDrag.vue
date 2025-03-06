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

const resizeMove = {
  "n-resize": (offset: Offset, _layout: Layout, start: MoveStart): Layout => {
    const layout = { ..._layout };
    if (start.height - offset.y < 0) {
      layout.y = start.layoutY + start.height;
      layout.height = 0;
    } else {
      layout.y = start.layoutY + offset.y;
      layout.height = start.height - offset.y;
    }
    return layout;
  },

  "e-resize": (offset: Offset, _layout: Layout, start: MoveStart): Layout => {
    const layout = { ..._layout };
    if (start.width + offset.x < 0) {
      layout.width = 0;
    } else {
      layout.width = start.width + offset.x;
    }
    return layout;
  },
  "w-resize": (offset: Offset, _layout: Layout, start: MoveStart): Layout => {
    const layout = { ..._layout };
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
  "s-resize": (offset: Offset, _layout: Layout, start: MoveStart): Layout => {
    const layout = { ..._layout };
    if (start.height + offset.y < 0) {
      layout.height = 0;
    } else {
      layout.height = start.height + offset.y;
    }

    return layout;
  },
  "ne-resize": (offset: Offset, _layout: Layout, start: MoveStart): Layout => {
    const layout = { ..._layout };
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
  "se-resize": (offset: Offset, _layout: Layout, start: MoveStart): Layout => {
    const layout = { ..._layout };
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

  "sw-resize": (
    _: Offset,
    _layout: Layout,
    start: MoveStart,
    e: MouseEvent
  ): Layout => {
    const layout = { ..._layout };
    const scaleFactor = 1 / props.scale; // 计算缩放修正因子
    const correct = {
      x: Math.round((start.x - Number(e.clientX)) * scaleFactor),
      y: Math.round((start.y - Number(e.clientY)) * scaleFactor),
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

  "nw-resize": (
    _: Offset,
    _layout: Layout,
    start: MoveStart,
    e: MouseEvent
  ): Layout => {
    const layout = { ..._layout };
    const scaleFactor = 1 / props.scale; // 计算缩放修正因子
    const correct = {
      x: Math.round((start.x - Number(e.clientX)) * scaleFactor),
      y: Math.round((start.y - Number(e.clientY)) * scaleFactor),
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
  move: (offset: Offset, _layout: Layout, start: MoveStart): Layout => {
    const layout = { ..._layout };
    const resultX = start.layoutX + offset.x;
    const resultY = start.layoutY + offset.y;
    layout.x = resultX;
    layout.y = resultY;
    return layout;
  },
  rotate: (offset: Offset, _layout: Layout, _: MoveStart): Layout => {
    const layout = { ..._layout };
    // 计算角度并标准化到[0, 360)范围
    const rawAngle = Math.atan2(offset.y, offset.x) * (180 / Math.PI);
    const normalizedAngle = (rawAngle + 360) % 360;
    layout.rotate = Math.round(normalizedAngle);
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
    centerX: model.value.x + model.value.width / 2,
    centerY: model.value.y + model.value.height / 2,
    // 获取对称点的坐标
    symmetricX: model.value.x + model.value.width,
    symmetricY: model.value.y + model.value.height,
  };
  let fist = true;
  document.documentElement.style.userSelect = "none";
  const move = (e: MouseEvent) => {
    if (fist) {
      fist = false;
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const scaleFactor = 1 / props.scale; // 计算缩放修正因子
    // 根据缩放倍率修正偏移量
    // let offsetX = (e.clientX - start.x) * scaleFactor;
    // let offsetY = (e.clientY - start.y) * scaleFactor;
    let offsetX = Math.round((e.clientX - start.x) * scaleFactor);
    let offsetY = Math.round((e.clientY - start.y) * scaleFactor);
    const offset = { x: offsetX, y: offsetY };
    document.documentElement.style.userSelect = "none";
    emits("moving", e, direction);
    console.log("move", direction);
    model.value = resizeMove[direction](offset, { ...model.value }, start, e);
    Object.keys(model.value).forEach((_key) => {
      const key = _key as keyof Layout;
      (model.value[key] as number) = Math.round(model.value[key] as number);
    });
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
    // rotate(${model.value.rotate}deg)
    zIndex: model.value.zIndex + 1,
    width: model.value.width + "px",
    height: model.value.height + "px",
  };
});
const resizes = computed(() => {
  let points = [
    {
      direction: "n-resize",
      style: {
        left: "50%",
        top: 0,
        transform: "translate(-50%, -50%)",
        // cursor: "n-resize",
      },
    },
    {
      direction: "s-resize",
      style: {
        left: "50%",
        bottom: 0,
        transform: "translate(-50%, 50%)",
        // cursor: "s-resize",
      },
    },
    {
      direction: "e-resize",
      style: {
        right: 0,
        top: "50%",
        transform: "translate(50%, -50%)",
        // cursor: "e-resize",
      },
    },
    {
      direction: "w-resize",
      style: {
        left: 0,
        top: "50%",
        transform: "translate(-50%, -50%)",
        // cursor: "w-resize",
      },
    },
    {
      direction: "ne-resize",
      style: {
        right: 0,
        top: 0,
        transform: "translate(50%, -50%)",
        // cursor: "ne-resize",
      },
    },
    {
      direction: "nw-resize",
      style: {
        left: 0,
        top: 0,
        transform: "translate(-50%, -50%)",
        // cursor: "nw-resize",
      },
    },
    {
      direction: "se-resize",
      style: {
        right: 0,
        bottom: 0,
        transform: "translate(50%, 50%)",
        // cursor: "se-resize",
      },
    },
    {
      direction: "sw-resize",
      style: {
        left: 0,
        bottom: 0,
        transform: "translate(-50%, 50%)",
        // cursor: "sw-resize",
      },
    },
  ];
  const angleToCursor = {
    // 每个范围的角度对应的光标
    nw: { start: 338, end: 23, cursor: "nw" },
   "n": { start: 23, end: 68, cursor: "n" },
   "ne": { start: 68, end: 113, cursor: "ne" },
    "e":{ start: 113, end: 158, cursor: "e" },
    { start: 158, end: 203, cursor: "se" },
    { start: 203, end: 248, cursor: "s" },
    { start: 248, end: 293, cursor: "sw" },
    { start: 293, end: 338, cursor: "w" },
  };
  const initialAngle = {
    // 每个点对应的初始角度
    lt: 0,
    t: 45,
    rt: 90,
    r: 135,
    rb: 180,
    b: 225,
    lb: 270,
    l: 315,
  };
  const rotate = (model.value.rotate + 360) % 360;
  points.forEach((point) => {
    const angle =
      (initialAngle[
        point.direction.split("-")[0] as keyof typeof initialAngle
      ] +
        rotate) %
      360;
    if (angle < 23 || angle >= 338) {
      result[point] = "nw-resize";
      return;
    }
    if (angleLimit.start <= angle && angle < angleLimit.end) {
      result[point] = angleLimit.cursor + "-resize";
      return;
    }
  });
  return points;
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
          :style="{ ...res.style }"
          :class="res.direction"
          @mousedown="
            mousedown($event, res.direction as keyof typeof resizeMove)
          "
        ></div>
      </template>
      <template v-else>
        <slot name="resizes" :active="active" :layout="model"></slot>
      </template>
      <template v-if="!$slots.rotate">
        <img
          src="../../assets/rotate.svg"
          class="rotate text-primary"
          @mousedown="mousedown($event, 'rotate')"
        />
      </template>
      <template v-else>
        <slot name="rotate" :active="active" :layout="model"></slot>
      </template>
    </template>
    <template v-if="!$slots.lock">
      <img
        @mousedown.stop="model.lock = !model.lock"
        v-show="model.lock"
        src="../../assets/lock-off.svg"
        class="lock"
      />
      <img
        @mousedown.stop="model.lock = !model.lock"
        v-show="!model.lock"
        src="../../assets/lock-on.svg"
        class="lock"
      />
    </template>
    <slot v-else name="lock" :active="active" :layout="model"></slot>
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
      cursor: $res;
    }
  }
  .rotate {
    position: absolute;
    width: 24px;
    height: 24px;
    font-size: 24px;
    top: -28px;
    left: 50%;
    transform: translateX(-50%);
    cursor: grab;
    &:active {
      cursor: grabbing;
    }
  }
  .lock {
    position: absolute;
    width: 24px;
    height: 24px;
    font-size: 24px;
    top: -28px;
    right: 0;
    cursor: pointer;
    display: block;
  }
}
.active {
  border: 1px dashed rgba(var(--z-primary), 0.5);
}
</style>
