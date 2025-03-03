<script setup lang="ts">
import { defineOptions, defineProps, defineModel, computed } from "vue";
import type { ZNodes } from "../ZDragEditor/types";
import type { ZNode } from "../ZNode/types";
import type { Layout } from "../ZDrag/types";
import type { ZAdsorptions } from "./type";
import { rotateLayout } from "../../common/utils";
// import * as d3 from "d3-quadtree";
defineOptions({
  name: "ZLines",
});
const moving = defineModel("moving", {
  required: true,
  type: Boolean,
});
const node = defineModel<ZNode | null>();
const props = defineProps<{
  nodeMap: Map<string, ZNode>;
  scale: number;
  nodes: ZNodes;
  canvasSize: { width: number; height: number };
}>();
const interval = 10;
const diff = 3;
const adsorption = computed(() => {
  if (!moving.value) return [] as ZAdsorptions;
  return checkAdsorption();
});

const checkAdsorption = () => {
  // 重置所有标线状态
  let nodes: ZNode[] = [];
  let parent = null;
  if (!node.value) return;
  const current = node.value;
  const currentRect = rotateLayout(current.layout);
  // const quadtree = d3
  //   .quadtree<ZNode>()
  //   .x((d) => d.layout.x)
  //   .y((d) => d.layout.y);
  if (
    props.nodeMap.has(node.value.parentId as string) &&
    (parent = props.nodeMap.get(node.value.parentId as string)) &&
    parent.children
  ) {
    // quadtree.extent([
    //   [0, 0],
    //   [parent.layout.width, parent.layout.height],
    // ]);
    nodes = parent.children.filter((n) => n.id !== current.id);
  } else {
    nodes = props.nodes.filter((n) => n.id !== current.id);
  }
  const lins = new Map();
  let start = 0;
  let end = nodes.length - 1;
  // console.log(nodes);
  while (start <= end) {
    const brothers = [nodes[start++], nodes[end--]];
    const diffFn = (brother: ZNode, _?: number, __?: ZNodes) => {
      const brotherRect = rotateLayout(brother.layout);

      const push = (key: string) => {
        if (lins.has(key)) {
          lins.get(key).push(brother);
        } else {
          lins.set(key, [brother]);
        }
      };
      const topIf = () => {
        if (brotherRect.x + brotherRect.width < currentRect.x) {
          push("top-left");
        } else if (brotherRect.x > currentRect.x + currentRect.width) {
          push("top-right");
        }
      };
      const bottomIf = () => {
        if (brotherRect.x + brotherRect.width < currentRect.x) {
          push("bottom-left");
        } else if (brotherRect.x > currentRect.x + currentRect.width) {
          push("bottom-right");
        }
      };
      const leftIf = () => {
        if (brotherRect.y + brotherRect.height < currentRect.y) {
          push("left-top");
        } else if (brotherRect.y > currentRect.y + currentRect.height) {
          push("left-bottom");
        }
      };
      const rightIf = () => {
        if (brotherRect.y + brotherRect.height < currentRect.y) {
          push("right-top");
        } else if (brotherRect.y > currentRect.y + currentRect.height) {
          push("right-bottom");
        }
      };
      // top
      if (
        Math.abs(brotherRect.y - currentRect.y) < interval ||
        Math.abs(brotherRect.y + brotherRect.height - currentRect.y) < interval
      ) {
        // console.log("top");
        topIf();
      }
      // bottom
      if (
        Math.abs(
          brotherRect.y +
            brotherRect.height -
            (currentRect.y + currentRect.height)
        ) < interval ||
        Math.abs(brotherRect.y - (currentRect.y + currentRect.height)) <
          interval
      ) {
        // console.log("bottom");
        bottomIf();
      }
      // left
      if (
        Math.abs(brotherRect.x - currentRect.x) < interval ||
        Math.abs(brotherRect.x + brotherRect.width - currentRect.x) < interval
      )
        leftIf();
      // right
      if (
        Math.abs(
          brotherRect.x + brotherRect.width - currentRect.x - currentRect.width
        ) < interval ||
        Math.abs(brotherRect.x - (currentRect.x + currentRect.width)) < interval
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
  // const filterFn = (
  //   target: {
  //     pre: ZNode;
  //     cur: ZNode;
  //     key: "x" | "y";
  //   },
  //   diff: ">" | "<"
  // ) => {
  //   switch (diff) {
  //     case ">":
  //       return target.pre.layout[target.key] > target.cur.layout[target.key]
  //         ? target.cur
  //         : target.pre;
  //     case "<":
  //       return target.pre.layout[target.key] < target.cur.layout[target.key]
  //         ? target.cur
  //         : target.pre;
  //   }
  // };
  const filter = {
    "top-left": (pre: ZNode, cur: ZNode) => {
      if (pre.layout.x < cur.layout.x) {
        return cur;
      } else {
        return pre;
      }
    },
    "top-right": (pre: ZNode, cur: ZNode) => {
      if (pre.layout.x > cur.layout.x) {
        return cur;
      } else {
        return pre;
      }
    },
    "bottom-left": (pre: ZNode, cur: ZNode) => {
      if (pre.layout.x < cur.layout.x) {
        return cur;
      } else {
        return pre;
      }
    },
    "bottom-right": (pre: ZNode, cur: ZNode) => {
      if (pre.layout.x > cur.layout.x) {
        return cur;
      } else {
        return pre;
      }
    },
    "left-top": (pre: ZNode, cur: ZNode) => {
      if (pre.layout.y < cur.layout.y) {
        return cur;
      } else {
        return pre;
      }
    },
    "left-bottom": (pre: ZNode, cur: ZNode) => {
      if (pre.layout.y > cur.layout.y) {
        return cur;
      } else {
        return pre;
      }
    },
    "right-top": (pre: ZNode, cur: ZNode) => {
      if (pre.layout.y < cur.layout.y) {
        return cur;
      } else {
        return pre;
      }
    },
    "right-bottom": (pre: ZNode, cur: ZNode) => {
      if (pre.layout.y > cur.layout.y) {
        return cur;
      } else {
        return pre;
      }
    },
  };
  const lineMap = {
    "top-left": (rect: Layout) => {
      
      return {
        y: currentRect.y + "px",
        x: rect.x + rect.width + "px",
        width: Math.round(currentRect.x - (rect.x + rect.width)) + "px",
        height: "1px",
        label: {
          text: Math.round(currentRect.x - (rect.x + rect.width)) + "px",
          style: {
            right: "0",
          },
        },
        key: "top-left",
      };
    },
    "top-right": (rect: Layout) => {
      return {
        y: currentRect.y + "px",
        x: currentRect.x + currentRect.width + "px",
        width: Math.round(rect.x - (currentRect.x + currentRect.width)) + "px",
        height: "1px",
        label: {
          text: Math.round(rect.x - (currentRect.x + currentRect.width)) + "px",
          style: {
            left: "0",
          },
        },
        key: "top-right",
      };
    },
    "bottom-left": (rect: Layout) => {
      return {
        y: currentRect.y + currentRect.height + "px",
        x: rect.x + rect.width + "px",
        width: Math.round(currentRect.x - (rect.x + rect.width)) + "px",
        height: "1px",
        label: {
          text: Math.round(currentRect.x - (rect.x + rect.width)) + "px",
          style: {
            right: "0",
          },
        },
        key: "bottom-left",
      };
    },
    "bottom-right": (rect: Layout) => {
      return {
        y: currentRect.y + currentRect.height + "px",
        x: currentRect.x + currentRect.width + "px",
        width: Math.round(rect.x - (currentRect.x + currentRect.width)) + "px",
        height: "1px",
        label: {
          text: Math.round(rect.x - (currentRect.x + currentRect.width)) + "px",
          style: {
            left: "0",
          },
        },
        key: "bottom-right",
      };
    },
    "left-top": (rect: Layout) => {
      return {
        key: "left-top",
        x: currentRect.x + "px",
        y: rect.y + rect.height + "px",
        width: "1px",
        height: Math.round(currentRect.y - (rect.y + rect.height)) + "px",
        label: {
          text: Math.round(currentRect.y - (rect.y + rect.height)) + "px",
          style: {
            bottom: "0",
          },
        },
      };
    },
    "left-bottom": (rect: Layout) => {
      return {
        key: "left-bottom",
        x: currentRect.x + "px",
        y: currentRect.y + currentRect.height + "px",
        width: "1px",
        height:
          Math.round(rect.y - (currentRect.y + currentRect.height)) + "px",
        label: {
          text:
            Math.round(rect.y - (currentRect.y + currentRect.height)) + "px",
          style: {
            top: "0",
          },
        },
      };
    },
    "right-top": (rect: Layout) => {
      return {
        x: currentRect.x + currentRect.width + "px",
        y: rect.y + rect.height + "px",
        width: "1px",
        height: Math.round(currentRect.y - (rect.y + rect.height)) + "px",
        label: {
          text: Math.round(currentRect.y - (rect.y + rect.height)) + "px",
          style: {
            bottom: "0",
          },
        },
        key: "right-top",
      };
    },
    "right-bottom": (rect: Layout) => {
      return {
        x: currentRect.x + currentRect.width + "px",
        y: currentRect.y + currentRect.height + "px",
        width: "1px",
        height:
          Math.round(rect.y - (currentRect.y + currentRect.height)) + "px",
        label: {
          text:
            Math.round(rect.y - (currentRect.y + currentRect.height)) + "px",
          style: {
            bottom: "0",
          },
        },
        key: "right-bottom",
      };
    },
  };
  const filterLines = Array.from(lins.keys()).map((key) => {
    const value = lins.get(key);
    const keyNode = value.reduce(
      (pre: ZNode, cur: ZNode): ZNode =>
        pre ? filter[key as keyof typeof filter](pre, cur) : cur
    );
    return lineMap[key as keyof typeof lineMap](rotateLayout(keyNode.layout));
  });
  lins.clear();
  return filterLines;
};
</script>
<template>
  <div class="ZLines">
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
  .line {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(var(--z-primary), 1);
    z-index: 999;
    .line-label {
      padding: 4px 8px;
      font-size: 12px;
      color: rgba(var(--z-primary), 1);
      position: absolute;
    }
  }
}
</style>
