<script setup lang="ts">
import { defineOptions, defineProps, defineModel, watch, ref } from "vue";
import type { ZNodes } from "../ZDragEditor/types";
import type { ZNode } from "../ZNode/types";
import * as d3 from "d3-quadtree";
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
const interval = 5;
const diff = 3;
const adsorption = ref(
  [
    {
      y: 0,
      x: 0,
      height: "1px",
      width: 0,
      label: {
        text: 0,
        style: {
          position: "absolute",
          right: 0,
        },
      },
      key: "top-left",
    },
    {
      y: 0,
      x: 0,
      height: 0,
      width: "1px",
      label: {
        text: 0,
        style: {
          position: "absolute",
          bottom: 0,
        },
      },
      key: "top-center",
    },
    {
      y: 0,
      x: 0,
      height: "1px",
      width: 0,
      label: {
        text: 0,
        style: {
          position: "absolute",
          left: 0,
        },
      },
      key: "top-right",
    },
    {
      y: 0,
      x: 0,
      height: "1px",
      width: 0,
      label: {
        text: 0,
        style: {
          position: "absolute",
          right: 0,
        },
      },
      key: "bottom-left",
    },
    {
      y: 0,
      x: 0,
      height: "1px",
      width: 0,
      label: {
        text: 0,
        style: {
          position: "absolute",
          right: 0,
        },
      },
      key: "bottom-center",
    },
    {
      y: 0,
      x: 0,
      height: "1px",
      width: 0,
      label: {
        text: 0,
        style: {
          position: "absolute",
          left: 0,
        },
      },
      key: "bottom-right",
    },
  ].map((i) => {
    return {
      ...i,
      ...{
        // ...其他配置
        visible: false,
        type: "horizontal", // 新增类型标识
      },
    };
  })
);

const checkAdsorption = () => {
  // 重置所有标线状态
  adsorption.value.forEach((line) => {
    line.width = 0;
    line.height = 0;
  });
  let nodes: ZNode[] = [];
  let parent = null;
  if (!node.value) return;
  const current = node.value;
  const currentRect = current.layout;
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
    // quadtree.extent([
    //   [0, 0],
    //   [props.canvasSize.width, props.canvasSize.height],
    // ]);
  const candidates = nodes.filter(n => Math.abs(n.layout.x - currentRect.x) < interval * 2 ||
    Math.abs(n.layout.y - currentRect.y) < interval * 2 ||
     Math.abs(n.layout.x - currentRect.x - currentRect.width) < interval * 2 ||
      Math.abs(n.layout.y - currentRect.y - currentRect.height) < interval * 2
  );
  console.log(candidates)
  // quadtree.addAll(nodes);

  // 更优的遍历方式（适合中小规模节点）
  // const candidates: {
  //   [key: string]: string;
  // } = {};
};
watch(
  () => moving.value,
  () => {
    if (!moving.value) return;
    checkAdsorption();
  }
);
</script>
<template>
  <div class="ZLines"></div>
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
    }
  }
}
</style>
