<script setup lang="ts">
import { defineOptions, ref, watch, onUnmounted, computed, defineModel } from "vue";
import {
  calculateMousedownPosition,
  whetherToMoveInAndOut,
  calculateGroupLayout,
} from "@/common/utils";
import type { ZDragNodes, ZDragNode, ZMap, ZLayout, ZCanvas } from "@/common/type";
import ZDrag from "../ZDrag/ZDrag.vue";
defineOptions({
  name: "ZArea",
});
const style = ref({
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  show: false,
});
const props = defineProps<{
  wrapper: HTMLElement | null;
  canvas: HTMLElement | null;
  scale: number;
  nodes: ZDragNodes;
  treeMap: ZMap;
  selectCanvas: ZCanvas;
  selectNode?: ZDragNode;
}>();
const selectCanvas = defineModel<ZCanvas>("selectCanvas", {
  required: true,
});
const areaNodes = ref<ZDragNodes>([]);
const processAreaNodes = computed(() => {
  return areaNodes.value.map((n) => {
    if (!n) return;
    const relativeId = n![n!.relative] as string;
    const container = props.treeMap.get(relativeId)!;
    const mode = {
      canvas: () => {
        const x = n.layout.x;
        const y = n.layout.y;
        return {
          ...n,
          layout: {
            ...n.layout,
            x,
            y,
          },
        };
      },
      page: () => {
        const x = container.layout.x + n.layout.x;
        const y = container.layout.y + n.layout.y;
        return {
          ...n,
          layout: {
            ...n.layout,
            x,
            y,
          },
        };
      },
    };
    return mode[container.type as keyof typeof mode]();
  });
});
const flatNodes = computed(() => {
  return props.nodes
    .flatMap((item) => (item.children ? [item, ...item.children] : [item]))
    .map((n) => {
      if (!n) return;
      const relativeId = n![n!.relative] as string;
      const container = props.treeMap.get(relativeId)!;
      const mode = {
        canvas: () => {
          const x = n.layout.x;
          const y = n.layout.y;
          return {
            ...n,
            rect: [x, y, x + n.layout.width, y + n.layout.height],
          };
        },
        page: () => {
          const x = container.layout.x + n.layout.x;
          const y = container.layout.y + n.layout.y;
          return {
            ...n,
            rect: [x, y, x + n.layout.width, y + n.layout.height],
          };
        },
      };
      return mode[container.type as keyof typeof mode]();
    });
});
const layout = ref({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  zIndex: 1,
  rotate: 0,
  lock: false,
});
watch(
  () => props.selectNode,
  () => {
    if (props.selectNode) {
      drag.value = false;
    }
  }
);
watch(
  () => props.selectCanvas,
  () => {
    drag.value = false;
  }
);
const drag = ref(false);
let nodesStartLayout: ZLayout[] = [];
let start: ZLayout = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  zIndex: 1,
  rotate: 0,
  lock: false,
};
const handlerStart = () => {
  nodesStartLayout = processAreaNodes.value.map((item) => item!.layout);
  start = {
    ...layout.value,
    ...calculateGroupLayout(processAreaNodes.value.map((item) => item!)),
  };
  layout.value = {
    ...start,
  };
};
const settlement = ({
  x,
  y,
  width,
  height,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
}) => {
  type ZRect = [number, number, number, number];
  interface Node extends ZDragNode {
    rect: ZRect;
  }
  const results: Node[] = [];
  const rect = [x, y, x + width, y + height];
  let start = 0;
  let end = flatNodes.value.length - 1;
  while (start < end) {
    const arr = [flatNodes.value[start++], flatNodes.value[end--]];
    arr.forEach((item) => {
      if (!item) return;
      const [x1, y1, x2, y2] = item.rect;
      if (x1 > rect[0] && y1 > rect[1] && x2 < rect[2] && y2 < rect[3]) {
        results.push(item as Node);
      }
    });
  }
  if (results.length) {
    areaNodes.value = [];
    results.forEach((item) => {
      const node = props.treeMap.get(item.id)! as ZDragNode;
      areaNodes.value.push(node);
    });
    handlerStart();
    drag.value = true;
  } else {
    drag.value = false;
    layout.value = {
      ...layout.value,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      zIndex: 1,
    };
  }
  // const r = quadtreeNodes.value.visit((node, x1, y1, x2, y2) => {
  //   console.log(node, x1, y1, x2, y2);
  //   console.log(x1 > rect[0] && y1 > rect[1] && x2 < rect[2] && y2 < rect[3]);
  //   // if (!node.length) {
  //   //   do {
  //   //     let d = node.data;
  //   //     if (d[0] >= rect[0] && d[0] < rect[2] && d[1] >= rect[1] && d[1] < rect[3]) {
  //   //       results.push(d);
  //   //     }
  //   //   } while ((node = node.next));
  //   // }
  //   // return rect[1] >
  //   return x1 > rect[0] && y1 > rect[1] && x2 < rect[2] && y2 < rect[3];
  //   // return x1 >= rect[2] || y1 >= rect[3] || x2 < rect[0] || y2 < rect[1];
  // });
  // console.log(r);
  // console.log(results);
};
const mousedown = (event: MouseEvent) => {
  if (!props.wrapper || !props.canvas || selectCanvas.value.mode !== "select") return;
  drag.value = false;
  const { x, y } = calculateMousedownPosition(event, props.canvas, props.scale);
  let start = {
    width: 0,
    height: 0,
    x,
    y,
  };
  const mousemove = (event: MouseEvent) => {
    if (!props.wrapper || !props.canvas) return;
    const { x, y } = calculateMousedownPosition(event, props.canvas, props.scale);
    const width = Math.abs(x - start.x);
    const height = Math.abs(y - start.y);
    style.value = {
      width,
      height,
      x: x < start.x ? x : start.x,
      y: y < start.y ? y : start.y,
      show: true,
    };
  };
  const mouseup = () => {
    settlement({ ...style.value });
    style.value = {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      show: false,
    };
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
    props.wrapper.addEventListener("mousedown", mousedown);
  }
);
const moving = () => {
  updateNodes(layout.value);
};
const afterMove = () => {
  handlerStart();
};
const updateNodes = (layout: ZDragNode["layout"]) => {
  if (!areaNodes.value.length) return;
  areaNodes.value.forEach((kids, i) => {
    // 计算子元素位置比例
    let childXRatio = (nodesStartLayout[i].x - start.x) / start.width;
    let childYRatio = (nodesStartLayout[i].y - start.y) / start.height;
    let childWidthRatio = nodesStartLayout[i].width / start.width;
    let childHeightRatio = nodesStartLayout[i].height / start.height;
    // 根据比例计算子元素位置
    let childXNew = Math.round(layout.x + childXRatio * layout.width);
    let childYNew = Math.round(layout.y + childYRatio * layout.height);
    let childWidthNew = Math.round(childWidthRatio * layout.width);
    let childHeightNew = Math.round(childHeightRatio * layout.height);
    const relativeId = kids![kids!.relative] as string;
    const container = props.treeMap.get(relativeId)!;
    const mode = {
      canvas: () => {
        return {
          ...kids.layout,
          x: childXNew,
          y: childYNew,
          width: childWidthNew,
          height: childHeightNew,
        };
      },
      page: () => {
        return {
          ...kids.layout,
          x: childXNew - container.layout.x,
          y: childYNew - container.layout.y,
          width: childWidthNew,
          height: childHeightNew,
        };
        // const x = container.layout.x + n.layout.x;
        // const y = container.layout.y + n.layout.y;
        // return {
        //   ...n,
        //   layout: {
        //     ...n.layout,
        //     x,
        //     y,
        //   },
        // };
      },
    };
    kids.layout = mode[container.type as keyof typeof mode]();
    whetherToMoveInAndOut(kids, props.treeMap, props.selectCanvas);
  });
};
onUnmounted(() => {
  if (!props.wrapper) return;
  props.wrapper.removeEventListener("mousedown", mousedown);
});
const withAreaStyle = computed(() => {
  return {
    width: `${style.value.width}px`,
    height: `${style.value.height}px`,
    transform: `translate(${style.value.x}px, ${style.value.y}px
  `,
    display: style.value.show ? "block" : "none",
  };
});
</script>
<template>
  <div>
    <div :style="withAreaStyle" class="z-area"></div>
    <ZDrag
      @after-move="afterMove"
      @moving="moving"
      v-if="canvas"
      :active="drag"
      position="absolute"
      :scale="scale"
      :rotate="false"
      v-model="layout"
      :has-lock="false"
      :container="canvas"
    ></ZDrag>
  </div>
</template>
<style scoped lang="scss">
.z-area {
  border: 1px solid rgb(var(--z-primary));
  z-index: 999;
  background-color: rgba(var(--z-primary), 0.3);
}
</style>
