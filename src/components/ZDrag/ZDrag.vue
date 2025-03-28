<script setup lang="ts">
import {
  defineOptions,
  defineModel,
  defineEmits,
  computed,
  defineProps,
  defineExpose,
  withDefaults,
} from "vue";
import type {
  ZDragProps,
  MoveStart,
  Offset,
  Direction,
  Points,
  AngleToCursor,
  Option,
  Resize,
  Moves,
} from "./type";
import {
  getCenterCoordinate,
  calculateRotateCoordinate,
  calculateMousedownPosition,
} from "@/common/utils";
import type { ZLayout } from "@/common/type";
import type { CSSProperties } from "vue";
import ZIcon from "../ZIcon/ZIcon.vue";
defineOptions({
  name: "ZDrag",
});
const props = withDefaults(defineProps<ZDragProps>(), {
  position: "absolute",
  rotate: true,
  hasLock: true, // 是否有锁定按钮
  hasRotate: true, // 是否有旋转按钮
});
const emits = defineEmits<{
  (e: "update:model", layout: ZLayout): void;
  (e: "before-move", event: MouseEvent, direction: Direction | Moves): void;
  (e: "after-move", event: MouseEvent, direction: Direction | Moves): void;
  (e: "moving", event: MouseEvent, direction: Direction | Moves): void;
}>();
// ["update:model", "before-move", "after-move", "moving"]
const scaleFactor = computed(() => 1 / props.scale);
const moves = {
  move: (offset: Offset, _layout: ZLayout, start: MoveStart): ZLayout => {
    const layout = { ..._layout };
    const resultX = start.layout.x + offset.x;
    const resultY = start.layout.y + offset.y;
    layout.x = Math.round(resultX);
    layout.y = Math.round(resultY);
    return layout;
  },
  rotate: (
    offset: Offset,
    _layout: ZLayout,
    _start: MoveStart,
    e?: MouseEvent
  ): ZLayout => {
    const layout = { ..._layout };
    if (!e) return layout;
    // 处理零偏移量的边界情况
    if (offset.x === 0 && offset.y === 0) {
      return { ...layout, rotate: 0 };
    }
    // 计算角度并标准化到[0, 360)范围
    const rawAngle = Math.atan2(offset.y, offset.x) * (180 / Math.PI);
    const normalizedAngle = (rawAngle + 360) % 360;
    layout.rotate = Math.round(normalizedAngle);
    return layout;
  },
};
const resize: Resize = {
  "nw-resize": (option: Option) => {
    let layout = { ...option.layout };
    const {
      realTimeCoordinates,
      start: { symmetric },
    } = option;
    const centerCoordinate = getCenterCoordinate(realTimeCoordinates, symmetric);
    const currentPoint = calculateRotateCoordinate(
      realTimeCoordinates,
      centerCoordinate,
      layout.rotate
    );
    const symmetricPoint = calculateRotateCoordinate(
      symmetric,
      centerCoordinate,
      layout.rotate
    );
    const width = symmetricPoint.x - currentPoint.x;
    const height = symmetricPoint.y - currentPoint.y;
    if (width > 0 && height > 0) {
      layout.width = Math.round(width);
      layout.height = Math.round(height);
      layout.x = Math.round(currentPoint.x);
      layout.y = Math.round(currentPoint.y);
    }
    return layout;
  },
  "ne-resize": (option: Option) => {
    let layout = { ...option.layout };
    const {
      realTimeCoordinates,
      start: { symmetric },
    } = option;
    const centerCoordinate = getCenterCoordinate(realTimeCoordinates, symmetric);
    const currentPoint = calculateRotateCoordinate(
      realTimeCoordinates,
      centerCoordinate,
      layout.rotate
    );
    const symmetricPoint = calculateRotateCoordinate(
      symmetric,
      centerCoordinate,
      layout.rotate
    );
    const width = currentPoint.x - symmetricPoint.x;
    const height = symmetricPoint.y - currentPoint.y;
    if (width > 0 && height > 0) {
      layout.width = Math.round(width);
      layout.height = Math.round(height);
      layout.x = Math.round(symmetricPoint.x);
      layout.y = Math.round(currentPoint.y);
    }
    return layout;
  },
  "n-resize": (option: Option) => {
    let layout = { ...option.layout };
    const {
      realTimeCoordinates,
      start: { point, symmetric },
    } = option;
    const currentPoint = calculateRotateCoordinate(
      realTimeCoordinates,
      point,
      layout.rotate
    );
    const topPoint = calculateRotateCoordinate(
      {
        x: point.x,
        y: currentPoint.y,
      },
      point,
      -layout.rotate
    );
    const height = Math.sqrt(
      (topPoint.x - symmetric.x) ** 2 + (topPoint.y - symmetric.y) ** 2
    );
    const center = {
      x: topPoint.x - (topPoint.x - symmetric.x) / 2,
      y: topPoint.y + (symmetric.y - topPoint.y) / 2,
    };
    if (height > 0) {
      layout.height = Math.round(height);
      layout.y = Math.round(center.y - layout.height / 2);
      layout.x = Math.round(center.x - layout.width / 2);
    }
    return layout;
  },
  "sw-resize": (option: Option) => {
    let layout = { ...option.layout };
    const {
      realTimeCoordinates,
      start: { symmetric },
    } = option;
    const centerCoordinate = getCenterCoordinate(realTimeCoordinates, symmetric);
    const currentPoint = calculateRotateCoordinate(
      symmetric,
      centerCoordinate,
      layout.rotate
    );
    const symmetricPoint = calculateRotateCoordinate(
      realTimeCoordinates,
      centerCoordinate,
      layout.rotate
    );
    const width = currentPoint.x - symmetricPoint.x;
    const height = symmetricPoint.y - currentPoint.y;
    if (width > 0 && height > 0) {
      layout.width = Math.round(width);
      layout.height = Math.round(height);
      layout.x = Math.round(symmetricPoint.x);
      layout.y = Math.round(currentPoint.y);
    }
    return layout;
  },
  "se-resize": (option: Option) => {
    let layout = { ...option.layout };
    const {
      realTimeCoordinates,
      start: { symmetric },
    } = option;
    const centerCoordinate = getCenterCoordinate(realTimeCoordinates, symmetric);
    const currentPoint = calculateRotateCoordinate(
      symmetric,
      centerCoordinate,
      layout.rotate
    );
    const symmetricPoint = calculateRotateCoordinate(
      realTimeCoordinates,
      centerCoordinate,
      layout.rotate
    );
    const width = symmetricPoint.x - currentPoint.x;
    const height = symmetricPoint.y - currentPoint.y;
    if (width > 0 && height > 0) {
      layout.width = Math.round(width);
      layout.height = Math.round(height);
      layout.x = Math.round(currentPoint.x);
      layout.y = Math.round(currentPoint.y);
    }
    return layout;
  },
  "s-resize": (option: Option) => {
    let layout = { ...option.layout };
    const {
      realTimeCoordinates,
      start: { point, symmetric },
    } = option;
    const currentPoint = calculateRotateCoordinate(
      realTimeCoordinates,
      point,
      layout.rotate
    );
    const bottomPoint = calculateRotateCoordinate(
      {
        x: point.x,
        y: currentPoint.y,
      },
      point,
      -layout.rotate
    );
    const height = Math.sqrt(
      (bottomPoint.x - symmetric.x) ** 2 + (bottomPoint.y - symmetric.y) ** 2
    );
    const center = {
      x: bottomPoint.x - (bottomPoint.x - symmetric.x) / 2,
      y: bottomPoint.y + (symmetric.y - bottomPoint.y) / 2,
    };
    if (height > 0) {
      layout.height = Math.round(height);
      layout.y = Math.round(center.y - height / 2);
      layout.x = Math.round(center.x - layout.width / 2);
    }
    return layout;
  },
  "w-resize": (option: Option) => {
    let layout = { ...option.layout };
    const {
      realTimeCoordinates,
      start: { point, symmetric },
    } = option;
    const currentPoint = calculateRotateCoordinate(
      realTimeCoordinates,
      point,
      layout.rotate
    );
    const leftPoint = calculateRotateCoordinate(
      {
        x: currentPoint.x,
        y: point.y,
      },
      point,
      -layout.rotate
    );
    const width = Math.sqrt(
      (leftPoint.x - symmetric.x) ** 2 + (leftPoint.y - symmetric.y) ** 2
    );
    const center = {
      x: leftPoint.x - (leftPoint.x - symmetric.x) / 2,
      y: leftPoint.y + (symmetric.y - leftPoint.y) / 2,
    };
    if (width > 0) {
      layout.width = Math.round(width);
      layout.x = Math.round(center.x - width / 2);
      layout.y = Math.round(center.y - layout.height / 2);
    }
    return layout;
  },
  "e-resize": (option: Option) => {
    let layout = { ...option.layout };
    const {
      realTimeCoordinates,
      start: { point, symmetric },
    } = option;
    const currentPoint = calculateRotateCoordinate(
      realTimeCoordinates,
      point,
      layout.rotate
    );
    const rightPoint = calculateRotateCoordinate(
      {
        x: currentPoint.x,
        y: point.y,
      },
      point,
      -layout.rotate
    );
    const width = Math.sqrt(
      (rightPoint.x - symmetric.x) ** 2 + (rightPoint.y - symmetric.y) ** 2
    );
    const center = {
      x: rightPoint.x - (rightPoint.x - symmetric.x) / 2,
      y: rightPoint.y + (symmetric.y - rightPoint.y) / 2,
    };
    if (width > 0) {
      layout.width = Math.round(width);
      layout.y = Math.round(center.y - layout.height / 2);
      layout.x = Math.round(center.x - width / 2);
    }
    return layout;
  },
};
const model = defineModel<ZLayout>({
  type: Object,
  default: (): ZLayout => {
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
const getPointAxis = (direction: Direction, layout: ZLayout) => {
  switch (direction) {
    case "n-resize":
      return {
        x: layout.x + layout.width / 2,
        y: layout.y,
      };
    case "s-resize":
      return {
        x: layout.x + layout.width / 2,
        y: layout.y + layout.height,
      };
    case "e-resize":
      return {
        x: layout.x + layout.width,
        y: layout.y + layout.height / 2,
      };
    case "w-resize":
      return {
        x: layout.x,
        y: layout.y + layout.height / 2,
      };
    case "ne-resize":
      return {
        x: layout.x + layout.width,
        y: layout.y,
      };
    case "nw-resize":
      return {
        x: layout.x,
        y: layout.y,
      };
    case "se-resize":
      return {
        x: layout.x + layout.width,
        y: layout.y + layout.height,
      };
    case "sw-resize":
      return {
        x: layout.x,
        y: layout.y + layout.height,
      };
    default:
      return null;
  }
};
const mousedown = (e: MouseEvent, direction: Direction | Moves) => {
  if (model.value.lock) return;
  if (!props.active) return;
  e.preventDefault();
  e.stopPropagation();
  emits("before-move", e, direction);
  const center = {
    x: model.value.x + model.value.width / 2,
    y: model.value.y + model.value.height / 2,
  };
  const canvasRect = props.container.getBoundingClientRect();
  const point =
    (() => {
      const point = getPointAxis(direction as Direction, model.value);
      if (!point) return;
      return calculateRotateCoordinate(point, center, -model.value.rotate);
    })() ?? calculateMousedownPosition(e, props.container, props.scale);
  // 获取对称点坐标
  const symmetric = {
    x: 2 * center.x - point.x,
    y: 2 * center.y - point.y,
  };
  const start: MoveStart = {
    x: Number(e.clientX),
    y: Number(e.clientY),
    layout: {
      x: model.value.x,
      y: model.value.y,
    },
    width: model.value.width,
    height: model.value.height,
    rotate: model.value.rotate,
    beforeAngle:
      Math.atan2(
        (e.layerY - center.y) * scaleFactor.value,
        (e.layerX - center.x) * scaleFactor.value
      ) /
      (Math.PI / 180), // 旋转角度
    center: center,
    symmetric,
    point,
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
    // 根据缩放倍率修正偏移量
    let offsetX = Math.round((e.clientX - start.x) * scaleFactor.value);
    let offsetY = Math.round((e.clientY - start.y) * scaleFactor.value);
    const offset = { x: offsetX, y: offsetY };
    document.documentElement.style.userSelect = "none";
    emits("moving", e, direction);
    if (!["move", "rotate"].includes(direction)) {
      const realTimeCoordinates = {
        x: (e.clientX - canvasRect.left) * scaleFactor.value,
        y: (e.clientY - canvasRect.top) * scaleFactor.value,
      };
      model.value = resize[direction as Direction]({
        start,
        layout: model.value,
        realTimeCoordinates,
      });
    } else {
      model.value = moves[direction as Moves](offset, model.value, start, e);
    }
  };
  const up = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    emits("after-move", e, direction);
    document.documentElement.style.userSelect = "auto";
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", up);
    window.removeEventListener("mouseleave", up);
  };
  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", up);
  window.addEventListener("mouseleave", up);
};

const style = computed(
  (): CSSProperties => {
    return {
      position: props.position,
      left: 0,
      top: 0,
      transform: `translate(${model.value.x}px, ${model.value.y}px) rotate(${
        model.value.rotate ?? 0
      }deg) translate3d(0,0,0)`,
      zIndex: model.value.zIndex + 1,
      width: model.value.width + "px",
      height: model.value.height + "px",
    };
  }
);
const points: Points = [
  {
    direction: "n-resize",
    style: {
      // left: "50%",
      left: 0,
      top: 0,
      width: "100%",
      height: "2px",
      // transform: "translate(-50%, -50%)",
    },
  },
  {
    direction: "s-resize",
    style: {
      left: 0,
      bottom: 0,
      width: "100%",
      height: "2px",
    },
  },
  {
    direction: "e-resize",
    style: {
      right: 0,
      top: 0,
      height: "100%",
      width: "2px",
    },
  },
  {
    direction: "w-resize",
    style: {
      left: 0,
      top: 0,
      height: "100%",
      width: "2px",
    },
  },
  {
    direction: "ne-resize",
    style: {
      right: 0,
      top: 0,
      transform: "translate(50%, -50%)",
    },
  },
  {
    direction: "nw-resize",
    style: {
      left: 0,
      top: 0,
      transform: "translate(-50%, -50%)",
    },
  },
  {
    direction: "se-resize",
    style: {
      right: 0,
      bottom: 0,
      transform: "translate(50%, 50%)",
    },
  },
  {
    direction: "sw-resize",
    style: {
      left: 0,
      bottom: 0,
      transform: "translate(-50%, 50%)",
    },
  },
];
// const points: Points = [
//   {
//     direction: "n-resize",
//     style: {
//       left: "50%",
//       top: 0,
//       transform: "translate(-50%, -50%)",
//     },
//   },
//   {
//     direction: "s-resize",
//     style: {
//       left: "50%",
//       bottom: 0,
//       transform: "translate(-50%, 50%)",
//     },
//   },
//   {
//     direction: "e-resize",
//     style: {
//       right: 0,
//       top: "50%",
//       transform: "translate(50%, -50%)",
//     },
//   },
//   {
//     direction: "w-resize",
//     style: {
//       left: 0,
//       top: "50%",
//       transform: "translate(-50%, -50%)",
//     },
//   },
//   {
//     direction: "ne-resize",
//     style: {
//       right: 0,
//       top: 0,
//       transform: "translate(50%, -50%)",
//     },
//   },
//   {
//     direction: "nw-resize",
//     style: {
//       left: 0,
//       top: 0,
//       transform: "translate(-50%, -50%)",
//     },
//   },
//   {
//     direction: "se-resize",
//     style: {
//       right: 0,
//       bottom: 0,
//       transform: "translate(50%, 50%)",
//     },
//   },
//   {
//     direction: "sw-resize",
//     style: {
//       left: 0,
//       bottom: 0,
//       transform: "translate(-50%, 50%)",
//     },
//   },
// ];
const createPoints = () => {
  const angleToCursor: AngleToCursor = [
    // 每个范围的角度对应的光标
    { start: 338, end: 23, cursor: "nw-resize" },
    { start: 23, end: 68, cursor: "n-resize" },
    { start: 68, end: 113, cursor: "ne-resize" },
    { start: 113, end: 158, cursor: "e-resize" },
    { start: 158, end: 203, cursor: "se-resize" },
    { start: 203, end: 248, cursor: "s-resize" },
    { start: 248, end: 293, cursor: "sw-resize" },
    { start: 293, end: 338, cursor: "w-resize" },
  ];
  const initialAngle = {
    nw: 0,
    n: 45,
    ne: 90,
    e: 135,
    se: 180,
    s: 225,
    sw: 270,
    w: 315,
  }; // 每个点对应的初始角度
  const rotate = (model.value.rotate + 360) % 360;
  points.forEach((point) => {
    const angle =
      (initialAngle[point.direction.split("-")[0] as keyof typeof initialAngle] +
        rotate) %
      360;
    return angle < 23 || angle >= 338
      ? (point.style.cursor = "nw-resize")
      : angleToCursor.some(({ start, end, cursor }) =>
          angle >= start && angle < end ? (point.style.cursor = cursor) : false
        );
    // if (angle < 23 || angle >= 338) {
    //   point.style.cursor = "nw-resize";
    //   return;
    // }
    // angleToCursor.some(({ start, end, cursor }) =>
    //   angle >= start && angle < end ? (point.style.cursor = cursor) : false
    // );
  });
  return points;
};
const lockChange = () => {
  model.value = {
    ...model.value,
    lock: !model.value.lock,
  };
};
const resizes = computed(createPoints);
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
    :tabindex="style.zIndex ? -style.zIndex : '-1'"
    :style="style"
  >
    <template v-if="!model.lock">
      <template v-if="!$slots.resizes">
        <div
          v-for="res in resizes"
          :key="res.direction"
          :style="{ ...res.style }"
          :class="{
            'resize-point': true,
            [res.direction]: true,
          }"
          @mousedown="mousedown($event, res.direction)"
        ></div>
      </template>
      <template v-else>
        <slot name="resizes" :active="active" :layout="model"></slot>
      </template>
      <template v-if="hasRotate">
        <template v-if="rotate">
          <template v-if="!$slots.rotate">
            <ZIcon
              tabindex="-1"
              class="rotate"
              @mousedown.stop="mousedown($event, 'rotate')"
              name="rotate"
            ></ZIcon> </template
          ><template v-else>
            <slot name="rotate" :active="active" :layout="model"></slot>
          </template>
        </template>
      </template>
    </template>
    <template v-if="hasLock">
      <template v-if="!$slots.lock">
        <ZIcon
          @mousedown.stop="lockChange"
          class="lock"
          color="primary"
          :name="model.lock ? 'lock_off' : 'lock_on'"
        ></ZIcon>
      </template>
      <slot v-else name="lock" :active="active" :layout="model"></slot>
    </template>
    <slot name="default" :active="active" :style="style" :layout="model"></slot>
  </div>
</template>
<style scoped lang="scss">
/**
 n-resize,
  s-resize,
  e-resize,
  w-resize,
*/
.resize-point {
  display: none;
  background: rgba(var(--z-primary), 1);
  position: absolute;
}
// // 定义resizes
$resizes: (ne-resize, se-resize, sw-resize, nw-resize);
// // 遍历resizes
@each $res in $resizes {
  .#{$res} {
    width: 8px;
    height: 8px;
    background: rgba(var(--z-page), 1);
    border: 1px solid rgba(var(--z-primary), 1);
    border-radius: 2px;
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
  display: none;
  color: rgb(var(--z-primary));
  // &:hover {
  //   color: rgb(var(--z-primary));
  // }
  &:active {
    // color: rgb(var(--z-primary));
    cursor: grabbing;
  }
}
.ZDrag {
  cursor: grab;
  box-sizing: border-box;
  &:active {
    cursor: grabbing;
  }

  .lock {
    position: absolute;
    width: 24px;
    height: 24px;
    font-size: 24px;
    top: -28px;
    right: 0;
    cursor: pointer;
    display: none;
    color: rgb(var(--z-primary));
  }

  &.active {
    border: 1px solid rgba(var(--z-primary), 1);
    .resize-point {
      display: block;
    }
    .lock {
      display: block;
    }
    .rotate {
      display: block;
    }
  }
}
</style>
