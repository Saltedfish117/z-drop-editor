<script setup lang="ts">
import {
  defineOptions,
  defineProps,
  defineModel,
  withDefaults,
  computed,
} from "vue";
import type { ZNodes } from "../ZDragEditor/types";
import type { ZNode } from "../ZNode/types";
import type { Layout } from "../ZDrag/types";
import type { ZAdsorptions, LineMap, ZAdsorption } from "./type";
import { rotateLayout, once } from "../../common/utils";
import { Color } from "@/common/type";
defineOptions({
  name: "ZLines",
});
const moving = defineModel("moving", {
  required: true,
  type: Boolean,
});
const node = defineModel<ZNode | null | undefined>();
const props = withDefaults(
  defineProps<{
    nodes: ZNodes;
    interval: number;
    diff: number;
    color: string;
  }>(),
  {
    interval: 10,
    diff: 3,
    color: "primary",
  }
);
const lineColor = computed(() => {
  if (Object.keys(Color).includes(props.color)) {
    return Color[props.color as keyof typeof Color];
  } else {
    return props.color;
  }
});
console.log(lineColor.value);
const createAdsorptions = (_nodes: ZNodes): ZAdsorptions => {
  // let parent = null;
  if (!node.value) return [];
  const current = node.value;
  let nodes: ZNode[] = _nodes.filter((n) => n.id !== current.id);
  let currentRect = rotateLayout(current.layout);
  // if (
  //   props.nodeMap.has(node.value.parentId as string) &&
  //   (parent = props.nodeMap.get(node.value.parentId as string)) &&
  //   parent.children
  // ) {
  //   nodes = parent.children.filter((n) => n.id !== current.id);
  // } else {
  //   nodes = props.nodes.filter((n) => n.id !== current.id);
  // }
  const lins = new Map<string, ZNodes>();
  let start = 0;
  let end = nodes.length - 1;
  const filters = {
    "top-left": (pre: ZNode, cur: ZNode) =>
      pre.layout.x < cur.layout.x ? cur : pre,
    "top-right": (pre: ZNode, cur: ZNode) =>
      pre.layout.x > cur.layout.x ? cur : pre,
    "bottom-left": (pre: ZNode, cur: ZNode) =>
      pre.layout.x < cur.layout.x ? cur : pre,
    "bottom-right": (pre: ZNode, cur: ZNode) =>
      pre.layout.x > cur.layout.x ? cur : pre,
    "left-top": (pre: ZNode, cur: ZNode) =>
      pre.layout.y < cur.layout.y ? cur : pre,
    "left-bottom": (pre: ZNode, cur: ZNode) =>
      pre.layout.y > cur.layout.y ? cur : pre,
    "right-top": (pre: ZNode, cur: ZNode) =>
      pre.layout.y < cur.layout.y ? cur : pre,
    "right-bottom": (pre: ZNode, cur: ZNode) =>
      pre.layout.y > cur.layout.y ? cur : pre,
  };
  const lineMap: LineMap = {
    "top-left": (rect: Layout): ZAdsorption => {
      const distance = Math.round(currentRect.x - (rect.x + rect.width));
      return {
        y: currentRect.y + "px",
        x: rect.x + rect.width + "px",
        width: Math.abs(distance + currentRect.width) + "px",
        height: "1px",
        label: {
          text: distance + "px",
          style: {
            left: "20%",
          },
        },
        key: "top-left",
      };
    },
    "top-right": (rect: Layout): ZAdsorption => {
      const distance = Math.round(rect.x - (currentRect.x + currentRect.width));
      return {
        y: currentRect.y + "px",
        x: currentRect.x + "px",
        width: Math.abs(rect.x - currentRect.x) + "px",
        height: "1px",
        label: {
          text: distance + "px",
          style: {
            right: "20%",
          },
        },
        key: "top-right",
      };
    },
    "bottom-left": (rect: Layout): ZAdsorption => {
      const distance = Math.round(currentRect.x - (rect.x + rect.width));
      return {
        y: currentRect.y + currentRect.height + "px",
        x: rect.x + rect.width + "px",
        width:
          Math.abs(currentRect.x + currentRect.width - (rect.x + rect.width)) +
          "px",
        height: "1px",
        label: {
          text: distance + "px",
          style: {
            left: "20%",
          },
        },
        key: "bottom-left",
      };
    },
    "bottom-right": (rect: Layout): ZAdsorption => {
      const distance = Math.round(rect.x - (currentRect.x + currentRect.width));
      return {
        y: currentRect.y + currentRect.height + "px",
        x: currentRect.x + "px",
        width: distance + currentRect.width + "px",
        height: "1px",
        label: {
          text: distance + "px",
          style: {
            right: "20%",
          },
        },
        key: "bottom-right",
      };
    },
    "left-top": (rect: Layout): ZAdsorption => {
      const distance = Math.round(currentRect.y - (rect.y + rect.height));
      return {
        key: "left-top",
        x: currentRect.x + "px",
        y: rect.y + rect.height + "px",
        width: "1px",
        height: distance + currentRect.height + "px",
        label: {
          text: distance + "px",
          style: {
            top: "20%",
          },
        },
      };
    },
    "left-bottom": (rect: Layout): ZAdsorption => {
      const distance = Math.round(
        rect.y - (currentRect.y + currentRect.height)
      );
      return {
        key: "left-bottom",
        x: currentRect.x + "px",
        y: currentRect.y + "px",
        width: "1px",
        height: distance + currentRect.height + "px",
        label: {
          text: distance + "px",
          style: {
            bottom: "20%",
          },
        },
      };
    },
    "right-top": (rect: Layout): ZAdsorption => {
      const distance = Math.round(currentRect.y - (rect.y + rect.height));
      return {
        x: currentRect.x + currentRect.width + "px",
        y: rect.y + rect.height + "px",
        width: "1px",
        height: distance + currentRect.height + "px",
        label: {
          text: distance + "px",
          style: {
            top: "20%",
          },
        },
        key: "right-top",
      };
    },
    "right-bottom": (rect: Layout): ZAdsorption => {
      const distance = Math.round(
        rect.y - (currentRect.y + currentRect.height)
      );
      return {
        x: currentRect.x + currentRect.width + "px",
        y: currentRect.y + "px",
        width: "1px",
        height: distance + currentRect.height + "px",
        label: {
          text: distance + "px",
          style: {
            bottom: "0",
          },
        },
        key: "right-bottom",
      };
    },
  };

  const diffMap = {
    top: once((rect: Layout) => {
      let diff = 0;
      if (
        Math.abs((diff = rect.y - currentRect.y)) <= props.diff ||
        Math.abs((diff = rect.y + rect.height - currentRect.y)) <= props.diff
      ) {
        node.value!.layout.y += Math.round(diff);
      }
    }),
    bottom: once((rect: Layout) => {
      let diff = 0;
      if (
        Math.abs(
          (diff = rect.y + rect.height - (currentRect.y + currentRect.height))
        ) <= props.interval ||
        Math.abs((diff = rect.y - (currentRect.y + currentRect.height))) <=
          props.interval
      ) {
        node.value!.layout.y += Math.round(diff);
      }
    }),
    left: once((rect: Layout) => {
      let diff = 0;
      if (
        Math.abs(
          (diff = rect.y + rect.height - (currentRect.y + currentRect.height))
        ) <= props.interval ||
        Math.abs((diff = rect.y - (currentRect.y + currentRect.height))) <=
          props.interval
      ) {
        node.value!.layout.x += Math.round(diff);
      }
    }),
    right: once((rect: Layout) => {
      let diff = 0;
      if (
        Math.abs(
          (diff = rect.x + rect.width - currentRect.x - currentRect.width)
        ) <= props.diff ||
        Math.abs((diff = rect.x - (currentRect.x + currentRect.width))) <=
          props.diff
      ) {
        node.value!.layout.x += Math.round(diff);
      }
    }),
  };
  while (start <= end) {
    const brothers = [nodes[start++], nodes[end--]];
    const diffFn = (brother: ZNode, _?: number, __?: ZNodes) => {
      const brotherRect = rotateLayout(brother.layout);
      const push = (key: string) => {
        if (lins.has(key)) {
          lins.get(key)!.push(brother);
        } else {
          lins.set(key, [brother]);
        }
      };
      const topIf = () => {
        if (brotherRect.x + brotherRect.width <= currentRect.x) {
          push("top-left");
        } else if (brotherRect.x >= currentRect.x + currentRect.width) {
          push("top-right");
        }
      };
      const bottomIf = () => {
        if (brotherRect.x + brotherRect.width <= currentRect.x) {
          push("bottom-left");
        } else if (brotherRect.x > currentRect.x + currentRect.width) {
          push("bottom-right");
        }
      };
      const leftIf = () => {
        if (brotherRect.y + brotherRect.height <= currentRect.y) {
          push("left-top");
        } else if (brotherRect.y >= currentRect.y + currentRect.height) {
          push("left-bottom");
        }
      };
      const rightIf = () => {
        if (brotherRect.y + brotherRect.height <= currentRect.y) {
          push("right-top");
        } else if (brotherRect.y >= currentRect.y + currentRect.height) {
          push("right-bottom");
        }
      };
      // top
      if (
        Math.abs(brotherRect.y - currentRect.y) <= props.interval ||
        Math.abs(brotherRect.y + brotherRect.height - currentRect.y) <=
          props.interval
      ) {
        topIf();
      }
      // bottom
      if (
        Math.abs(
          brotherRect.y +
            brotherRect.height -
            (currentRect.y + currentRect.height)
        ) <= props.interval ||
        Math.abs(brotherRect.y - (currentRect.y + currentRect.height)) <=
          props.interval
      ) {
        bottomIf();
      }
      // left
      if (
        Math.abs(brotherRect.x - currentRect.x) <= props.interval ||
        Math.abs(brotherRect.x + brotherRect.width - currentRect.x) <=
          props.interval
      )
        leftIf();
      // right
      if (
        Math.abs(
          brotherRect.x + brotherRect.width - currentRect.x - currentRect.width
        ) <= props.interval ||
        Math.abs(brotherRect.x - (currentRect.x + currentRect.width)) <=
          props.interval
      ) {
        rightIf();
      }
    };
    if (brothers[0] === brothers[1]) {
      diffFn(brothers[0]);
      break;
    }
    brothers.forEach(diffFn);
  }
  const filterLines = Array.from(lins.keys()).map((key) => {
    const value = lins.get(key);
    const keyNode = value!.reduce(
      (pre: ZNode, cur: ZNode): ZNode =>
        pre ? filters[key as keyof typeof filters](pre, cur) : cur
    );
    const diffKey = key.split("-")[0] as keyof typeof diffMap;
    diffMap[diffKey](rotateLayout(keyNode.layout));
    currentRect = rotateLayout(node.value!.layout);
    return lineMap[key as keyof typeof lineMap](rotateLayout(keyNode.layout));
  });
  lins.clear();
  return filterLines;
};
const adsorption = computed((): ZAdsorptions => {
  if (node.value && node.value.layout && moving.value)
    return createAdsorptions(props.nodes);
  else return [];
});
</script>
<template>
  <div
    class="ZLines"
    :style="{
      '--line-color': lineColor,
    }"
  >
    <div
      class="line"
      v-for="line in adsorption"
      :style="{
        transform: `translate(${line.x}, ${line.y})`,
        width: line.width,
        height: line.height,
      }"
      :key="line.key"
    >
      <div class="line-label" :style="line.label.style">
        {{ line.label.text }}
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.ZLines {
  position: absolute;
  top: 0;
  left: 0;
  --line-color: rgba(var(--z-primary), 1);
  .line {
    position: absolute;
    top: 0;
    left: 0;
    background-color: var(--line-color);
    z-index: 999;
    .line-label {
      padding: 4px 8px;
      font-size: 12px;
      color: var(--line-color);
      position: absolute;
    }
  }
}
</style>
