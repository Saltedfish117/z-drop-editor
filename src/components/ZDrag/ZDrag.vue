<script setup lang="ts">
import {
  defineOptions,
  defineModel,
  defineEmits,
  computed,
  defineProps,
  defineExpose,
} from "vue";
import type {
  Layout,
  ZDragProps,
  MoveStart,
  Offset,
  Direction,
  Points,
  AngleToCursor,
  ResizeMove,
} from "./types";
import { getCenterCoordinate, calculateRotateCoordinate } from "@/common/utils";
import type { CSSProperties } from "vue";
import ZSvgIcon from "../ZSvgIcon/ZSvgIcon.vue";
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
  "nw-resize": (
    _: Offset,
    _layout: Layout,
    start: MoveStart,
    e: MouseEvent
  ) => {
    if (!e) return _layout;
    const layout = { ..._layout };
    if (layout.rotate !== 0) {
      // if (e.layerX < 0 || e.layerY < 0) return layout;
      const canvas = document.getElementsByClassName("infinite-canvas")[0];
      const editorRectInfo = canvas.getBoundingClientRect();
      const realTimeCoordinates = {
        x: e.clientX - editorRectInfo.left,
        y: e.clientY - editorRectInfo.top,
      };
      const centerCoordinate = getCenterCoordinate(
        realTimeCoordinates,
        start.symmetric
      );
      const currentPoint = calculateRotateCoordinate(
        realTimeCoordinates,
        centerCoordinate,
        layout.rotate
      );
      const symmetricPoint = calculateRotateCoordinate(
        start.symmetric,
        centerCoordinate,
        layout.rotate
      );
      // console.log("point", currentPoint, symmetricPoint);
      const width = symmetricPoint.x - currentPoint.x;
      const height = symmetricPoint.y - currentPoint.y;
      if (width > 0 && height > 0) {
        layout.width = width;
        layout.height = height;
        layout.x = currentPoint.x;
        layout.y = currentPoint.y;
      }
    } else {
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
    }

    return layout;
  },
  "ne-resize": (
    offset: Offset,
    _layout: Layout,
    start: MoveStart,
    e: MouseEvent
  ): Layout => {
    if (!e) return _layout;
    const layout = { ..._layout };
    if (layout.rotate !== 0) {
      if (e.layerX < 0 || e.layerY < 0) return layout;
      console.log(e);
      const canvas = document.getElementsByClassName("infinite-canvas")[0];
      const editorRectInfo = canvas.getBoundingClientRect();
      const realTimeCoordinates = {
        x: e.clientX - editorRectInfo.left,
        y: e.clientY - editorRectInfo.top,
      };

      const centerCoordinate = getCenterCoordinate(
        realTimeCoordinates,
        start.symmetric
      );
      const currentPoint = calculateRotateCoordinate(
        realTimeCoordinates,
        centerCoordinate,
        layout.rotate
      );
      const symmetricPoint = calculateRotateCoordinate(
        start.symmetric,
        centerCoordinate,
        layout.rotate
      );
      const width = currentPoint.x - symmetricPoint.x;
      const height = symmetricPoint.y - currentPoint.y;
      if (width > 0 && height > 0) {
        layout.width = width;
        layout.height = height;
        layout.x = symmetricPoint.x;
        layout.y = currentPoint.y;
      }
    } else {
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
    }

    return layout;
  },
  "n-resize": (
    offset: Offset,
    _layout: Layout,
    start: MoveStart,
    e: MouseEvent
  ): Layout => {
    const layout = { ..._layout };
    if (!e) return layout;
    if (layout.rotate !== 0) {
      const canvas = document.getElementsByClassName("infinite-canvas")[0];
      const editorRectInfo = canvas.getBoundingClientRect();
      const realTimeCoordinates = {
        x: e.clientX - editorRectInfo.left,
        y: e.clientY - editorRectInfo.top,
      };
      const currentPoint = calculateRotateCoordinate(
        realTimeCoordinates,
        start.point,
        layout.rotate
      );
      const topPoint = calculateRotateCoordinate(
        {
          x: start.point.x,
          y: currentPoint.y,
        },
        start.point,
        -layout.rotate
      );
      const height = Math.sqrt(
        (topPoint.x - start.symmetric.x) ** 2 +
          (topPoint.y - start.symmetric.y) ** 2
      );
      const center = {
        x: topPoint.x - (topPoint.x - start.symmetric.x) / 2,
        y: topPoint.y + (start.symmetric.y - topPoint.y) / 2,
      };
      if (height > 0) {
        layout.height = height;
        layout.y = center.y - height / 2;
        layout.x = center.x - layout.width / 2;
      }
    } else {
      if (start.height - offset.y < 0) {
        layout.y = start.layoutY + start.height;
        layout.height = 0;
      } else {
        layout.y = start.layoutY + offset.y;
        layout.height = start.height - offset.y;
      }
    }
    return layout;
  },
  "e-resize": (
    offset: Offset,
    _layout: Layout,
    start: MoveStart,
    e: MouseEvent
  ): Layout => {
    const layout = { ..._layout };
    if (!e) return layout;
    if (layout.rotate !== 0) {
      const canvas = document.getElementsByClassName("infinite-canvas")[0];
      const editorRectInfo = canvas.getBoundingClientRect();
      const realTimeCoordinates = {
        x: e.clientX - editorRectInfo.left,
        y: e.clientY - editorRectInfo.top,
      };
      const { symmetric, point } = start;
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
        layout.width = width;
        layout.y = center.y - layout.height / 2;
        layout.x = center.x - width / 2;
      }
    } else {
      if (start.width + offset.x < 0) {
        layout.width = 0;
      } else {
        layout.width = start.width + offset.x;
      }
    }
    return layout;
  },
  "w-resize": (
    offset: Offset,
    _layout: Layout,
    start: MoveStart,
    e: MouseEvent
  ): Layout => {
    const layout = { ..._layout };
    if (layout.rotate !== 0) {
      const canvas = document.getElementsByClassName("infinite-canvas")[0];
      const editorRectInfo = canvas.getBoundingClientRect();
      const realTimeCoordinates = {
        x: e.clientX - editorRectInfo.left,
        y: e.clientY - editorRectInfo.top,
      };
      const currentPoint = calculateRotateCoordinate(
        realTimeCoordinates,
        start.point,
        layout.rotate
      );
      const leftPoint = calculateRotateCoordinate(
        {
          x: currentPoint.x,
          y: start.point.y,
        },
        start.point,
        -layout.rotate
      );
      const width = Math.sqrt(
        (leftPoint.x - start.symmetric.x) ** 2 +
          (leftPoint.y - start.symmetric.y) ** 2
      );
      const center = {
        x: leftPoint.x - (leftPoint.x - start.symmetric.x) / 2,
        y: leftPoint.y + (start.symmetric.y - leftPoint.y) / 2,
      };
      if (width > 0) {
        layout.width = width;
        layout.x = center.x - width / 2;
        layout.y = center.y - layout.height / 2;
      }
    } else {
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
    }
    return layout;
  },
  "s-resize": (
    offset: Offset,
    _layout: Layout,
    start: MoveStart,
    e: MouseEvent
  ): Layout => {
    const layout = { ..._layout };
    if (layout.rotate !== 0) {
      const canvas = document.getElementsByClassName("infinite-canvas")[0];
      const editorRectInfo = canvas.getBoundingClientRect();
      const realTimeCoordinates = {
        x: e.clientX - editorRectInfo.left,
        y: e.clientY - editorRectInfo.top,
      };
      const currentPoint = calculateRotateCoordinate(
        realTimeCoordinates,
        start.point,
        layout.rotate
      );
      const bottomPoint = calculateRotateCoordinate(
        {
          x: start.point.x,
          y: currentPoint.y,
        },
        start.point,
        -layout.rotate
      );
      const height = Math.sqrt(
        (bottomPoint.x - start.symmetric.x) ** 2 +
          (bottomPoint.y - start.symmetric.y) ** 2
      );
      const center = {
        x: bottomPoint.x - (bottomPoint.x - start.symmetric.x) / 2,
        y: bottomPoint.y + (start.symmetric.y - bottomPoint.y) / 2,
      };

      layout.height = Math.round(height);
      layout.y = Math.round(center.y - height / 2);
      layout.x = Math.round(center.x - layout.width / 2);
    } else {
      if (start.height + offset.y < 0) {
        layout.height = 0;
      } else {
        layout.height = start.height + offset.y;
      }
    }
    return layout;
  },
  "se-resize": (
    offset: Offset,
    _layout: Layout,
    start: MoveStart,
    e: MouseEvent
  ): Layout => {
    const layout = { ..._layout };
    if (layout.rotate !== 0) {
      const canvas = document.getElementsByClassName("infinite-canvas")[0];
      const editorRectInfo = canvas.getBoundingClientRect();
      const realTimeCoordinates = {
        x: e.clientX - editorRectInfo.left,
        y: e.clientY - editorRectInfo.top,
      };
      const centerCoordinate = getCenterCoordinate(
        realTimeCoordinates,
        start.symmetric
      );
      const currentPoint = calculateRotateCoordinate(
        start.symmetric,
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
        layout.width = width;
        layout.height = height;
        layout.x = currentPoint.x;
        layout.y = currentPoint.y;
      }
    } else {
      layout.width = start.width + offset.x;
      layout.height = start.height + offset.y;
      if (layout.width <= 0) {
        layout.width = 0;
      }
      if (layout.height <= 0) {
        layout.height = 0;
      }
    }
    return layout;
  },
  "sw-resize": (
    _: Offset,
    _layout: Layout,
    start: MoveStart,
    e?: MouseEvent
  ): Layout => {
    const layout = { ..._layout };
    if (!e) return _layout;
    if (layout.rotate !== 0) {
      const canvas = document.getElementsByClassName("infinite-canvas")[0];
      const editorRectInfo = canvas.getBoundingClientRect();
      const realTimeCoordinates = {
        x: e.clientX - editorRectInfo.left,
        y: e.clientY - editorRectInfo.top,
      };
      const centerCoordinate = getCenterCoordinate(
        realTimeCoordinates,
        start.symmetric
      );
      const currentPoint = calculateRotateCoordinate(
        start.symmetric,
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
        layout.width = width;
        layout.height = height;
        layout.x = symmetricPoint.x;
        layout.y = currentPoint.y;
      }
    } else {
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
  rotate: (
    _offset: Offset,
    _layout: Layout,
    start: MoveStart,
    e?: MouseEvent
  ): Layout => {
    const layout = { ..._layout };
    if (!e) return layout;
    // 计算角度并标准化到[0, 360)范围
    const rawAngle =
      Math.atan2(e.layerY - start.center.y, e.layerX - start.center.x) /
      (Math.PI / 180);
    layout.rotate = Math.round(start.rotate + rawAngle - start.beforeAngle);
    return layout;
  },
};
const mousedown = (e: MouseEvent, direction: Direction) => {
  if (model.value.lock) return;
  emits("before-move", e, direction);
  console.dir(e);
  e.preventDefault();
  e.stopPropagation();
  const scaleFactor = 1 / props.scale; // 计算缩放修正因子
  const canvas = document.getElementsByClassName("infinite-canvas")[0];
  const editorRectInfo = canvas.getBoundingClientRect();
  let point = {
    x: e.clientX - editorRectInfo.left,
    y: e.clientY - editorRectInfo.top,
  };
  const center = {
    x: model.value.x + model.value.width / 2,
    y: model.value.y + model.value.height / 2,
  };
  // 获取对称点坐标
  let symmetric = {
    x: 2 * center.x - point.x,
    y: 2 * center.y - point.y,
  };
  console.log("center", center);
  console.log("start-point", point, symmetric);
  // symmetric = calculateRotateCoordinate(point, center, model.value.rotate);
  // if (!["move", "rotate"].includes(direction)) {
  //   // point = calculatePointAxis(direction);
  //   symmetric = calculateRotateCoordinate(point, center, model.value.rotate);
  // }

  // console.log("point", point);
  // console.log("center", center);
  // console.log("symmetric", symmetric);
  const start: MoveStart = {
    x: Number(e.clientX),
    y: Number(e.clientY),
    layoutX: model.value.x,
    layoutY: model.value.y,
    width: model.value.width,
    height: model.value.height,
    rotate: model.value.rotate,
    beforeAngle:
      Math.atan2(e.layerY - center.y, e.layerX - center.x) / (Math.PI / 180), // 旋转角度
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
    if (!["move", "rotate"].includes(direction)) {
    }
    // 根据缩放倍率修正偏移量
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
    window.removeEventListener("mouseleave", up);
  };
  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", up);
  window.addEventListener("mouseleave", up);
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
    transform: `translate(${model.value.x}px, ${model.value.y}px) rotate(${model.value.rotate}deg) translate3d(0,0,0)`,
    // rotate(${model.value.rotate}deg)
    zIndex: model.value.zIndex + 1,
    width: model.value.width + "px",
    height: model.value.height + "px",
  };
});
const createPoints = () => {
  const points: Points = [
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
    // const axis = calculatePointAxis(point.direction);
    // point.style.transform = `translate(${axis.x}px,${axis.y}px)`;
    // point.style.left = 0;
    // point.style.top = 0;
    // point.style.right = undefined;
    // point.style.bottom = undefined;
    // point.style.zIndex = model.value.zIndex + 1;
    const angle =
      (initialAngle[
        point.direction.split("-")[0] as keyof typeof initialAngle
      ] +
        rotate) %
      360;
    if (angle < 23 || angle >= 338) {
      point.style.cursor = "nw-resize";
      return;
    }
    angleToCursor.some(({ start, end, cursor }) => {
      if (angle >= start && angle < end) {
        point.style.cursor = cursor;
        return true;
      } else return false;
    });
  });
  return points;
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
    :tabindex="style.zIndex"
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
        <ZSvgIcon
          @mousedown="mousedown($event, 'rotate')"
          class="rotate"
          color="primary"
          name="rotate"
        ></ZSvgIcon>
      </template>
      <template v-else>
        <slot name="rotate" :active="active" :layout="model"></slot>
      </template>
    </template>
    <template v-if="!$slots.lock">
      <ZSvgIcon
        @mousedown.stop="model.lock = !model.lock"
        @mousedown="mousedown($event, 'rotate')"
        class="lock"
        color="primary"
        :name="model.lock ? 'lock-off' : 'lock-on'"
      ></ZSvgIcon>
    </template>
    <slot v-else name="lock" :active="active" :layout="model"></slot>
    <slot name="default" :active="active" :layout="model"></slot>
  </div>
</template>
<style scoped lang="scss">
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
.ZDrag {
  cursor: grab;
  &:active {
    cursor: grabbing;
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
