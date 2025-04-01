<script setup lang="ts">
import { defineOptions, computed, defineEmits, withDefaults } from "vue";
import type { CssProperties } from "vue";
import type { ZMap, ZLayout, ZDragNode } from "@/common/type";
import { rotateLayout, getId } from "@/common/utils";
import { filter, quadtree, reduce, select, style } from "d3";
import type ZDrag from "../ZDrag";
defineOptions({
  name: "ZLines",
});
const props = withDefaults(
  defineProps<{
    treeMap: ZMap;
    modelValue?: ZLayout;
    selectNode: ZDragNode;
    diff?: number;
    wrapper: HTMLElement;
  }>(),
  {
    diff: 8,
  }
);
// const emits = defineEmits(["update:modelValue"]);
const model = defineModel<ZLayout>({
  default: () => ({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    zIndex: 1,
    rotate: 0,
    lock: false,
  }),
});
const nodes = computed(() => {
  let parent = props.treeMap.get(props.selectNode.parentId as string);
  if (!parent) return [];
  if (parent.type === "group")
    parent = props.treeMap.get((parent as ZDragNode).parentId as string)!;
  console.log("parent", parent);
  const ns = parent.children!.filter((item) => item.id !== props.selectNode.id);
  return ns.map((item: ZDragNode) => {
    const container = props.treeMap.get(item[item.relative] as string)!;
    let layout = {
      ...item.layout,
      // x: container.layout.x + item.layout.x,
      // y: container.layout.y + item.layout.y,
    };
    if (container.type === "canvas") {
      layout = {
        ...item.layout,
      };
    } else {
      layout = {
        ...item.layout,
        x: container.layout.x + item.layout.x,
        y: container.layout.y + item.layout.y,
      };
    }
    return {
      id: item.id,
      layout: rotateLayout(layout),
    };
  });
});
// const nodeRects = computed(() => {
//   return nodes.value.map((item) => {
//     return {
//       ...item,
//       rect: getRect(item.layout),
//     };
//   });
// });
// const trees = computed(() => {
//   let vertical = nodeVertical.value;
//   // const tree = {
//   //   left: quadtree().addAll(vertical.map((item) => item[0])),
//   //   right: quadtree().addAll(vertical.map((item) => item[1])),
//   //   center: quadtree().addAll(vertical.map((item) => item[2])),
//   //   top: quadtree().addAll(vertical.map((item) => item[3])),
//   //   bottom: quadtree().addAll(vertical.map((item) => item[4])),
//   // };
// });
// const recently = computed(() => {
//   return quadtree<ZDragNode>()
//     .x((item) => item.layout.x + item.layout.width / 2)
//     .y((item) => item.layout.y + item.layout.height / 2)
//     .addAll(nodes.value)
//     .find(
//       props.modelValue.x + props.modelValue.width / 2,
//       props.modelValue.y + props.modelValue.height / 2
//     );
// });
const lineSize = "3px";
const lines = computed<CssProperties[]>(() => {
  try {
    let Ls: CssProperties[] = [];
    const left: CssProperties[] = [];
    const { x, y, width, height } = rotateLayout(props.modelValue);
    nodes.value.forEach((item) => {
      const { x: nx, y: ny, width: nw, height: nh } = item.layout;
      if (Math.abs(nx - x) <= props.diff) {
        let style = {
          w: 0,
          h: 0,
          x: nx,
          y: 0,
        };
        if (ny >= y) {
          style.y = y + height;
          style.h = ny - y - height;
        } else {
          style.y = ny + nh;
          style.h = y - ny - nh;
        }
        left.push(style);
      }
    });
    if (left.length) {
      const l = left.reduce((pre, cur) => {
        if (!pre) return cur;
        if (pre.y > cur.y) {
          return pre;
        } else {
          return cur;
        }
      });
      model.value.x = l.x;
      Ls.push({
        width: lineSize,
        height: `${l.h}px`,
        transform: `translate(${l.x}px, ${l.y}px)`,
      });
      console.log(l);
    }

    // const targetRect = getRect(props.modelValue);
    // const targetVertical = targetRect.slice(0, 3);
    // const targetHorizontal = targetRect.slice(3);
    // // targetVertical.forEach((item) => {});
    // nodeRects.value.forEach((node) => {
    //   const rect = node.rect;
    // });
    // const left =
    // nodes.value.forEach((node) => {
    //   const rect = getRect(node.layout);
    //   const nodeVertical = rect.slice(0, 3);
    //   const nodeHorizontal = rect.slice(3);
    //   targetVertical.forEach((item, i) => {
    //     if (Math.abs(item[1] - nodeVertical[i][1]) <= props.diff) {
    //       console.log("1", item[1], nodeVertical[i][1]);
    //     }
    //   });
    //   targetHorizontal.forEach((item, i) => {
    //     if (Math.abs(item[1] - nodeHorizontal[i][1]) <= props.diff) {
    //       console.log("2", item[1], nodeHorizontal[i][1]);
    //     }
    //   });
    // });
    // if (!recently.value) return [];
    // const ls = nodes.value.map((node) => {
    //   const rect = getRect(node.layout);
    //   const vertical = rect.slice(0, 3);
    //   const horizontal = rect.slice(3);
    //   return [
    //     ...vertical.map((item) => {
    //       return {
    //         height: `${props.wrapper.clientHeight}px`,
    //         width: lineSize,
    //         transform: `translate(${item[0]}px, ${0}px)`,
    //       };
    //     }),
    //     ...horizontal.map((item) => {
    //       return {
    //         width: `${props.wrapper.clientWidth}px`,
    //         height: lineSize,
    //         transform: `translate(${-node.layout.x}px, ${item[1]}px)`,
    //       };
    //     }),
    //   ];
    // });
    return Ls;
  } catch (error) {
    console.log(error);
  }
  // const rect = getRect(props.modelValue);
  // const recentlyRect = getRect(recently.value.layout);
  // const recentlyVertical = recentlyRect.slice(0, 3);
  // const recentlyHorizontal = recentlyRect.slice(3);
  // const vertical = rect.slice(0, 3);
  // const horizontal = rect.slice(3);
  // const horizontalLines: CssProperties[] = [];
  // const verticalLines: CssProperties[] = [];
  // if (recently.value.layout.y > props.modelValue.y) {
  //   console.log("11");
  //   vertical.forEach((item, i) => {
  //     console.log("1", Math.abs(item[1] - recentlyVertical[i][1]) <= props.diff);
  //     if (Math.abs(item[1] - recentlyVertical[i][1]) <= props.diff) {
  //       verticalLines.push({
  //         width: lineSize,
  //         height: `${recentlyVertical[i][1] - item[1]}px`,
  //         transform: `translate(${item[0]}px, ${item[1]}px)`,
  //       });
  //     }
  //   });
  // } else {
  //   console.log("22");
  //   // vertical.forEach((item, i) => {
  //   //   console.log("2", Math.abs(item[1] - recentlyRect[i][1]) <= props.diff);
  //   //   if (Math.abs(item[1] - recentlyRect[i][1]) <= props.diff) {
  //   //     verticalLines.push({
  //   //       width: lineSize,
  //   //       height: `${item[1] - recentlyRect[i][1]}px`,
  //   //       transform: `translate(${item[0]}px, ${recentlyRect[i][1]}px)`,
  //   //     });
  //   //   }
  //   // });
  // }
  // if (recently.value.layout.x > props.modelValue.x) {
  // } else {
  // }
  // const Ls = [...horizontalLines, ...verticalLines];
  // return Ls;
  // return vertical.map((item, index) => {
  //   if (Math.abs(item[0] - l[0]) <= props.diff) {
  //     return {};
  //   }
  // });
});
// const trees = computed(() => {
//   let vertical = nodeVertical.value;
//   // const tree = {
//   //   left: quadtree().addAll(vertical.map((item) => item[0])),
//   //   right: quadtree().addAll(vertical.map((item) => item[1])),
//   //   center: quadtree().addAll(vertical.map((item) => item[2])),
//   //   top: quadtree().addAll(vertical.map((item) => item[3])),
//   //   bottom: quadtree().addAll(vertical.map((item) => item[4])),
//   // };
// });
// const diff = 3; // 接近的距离在这个范围内
// const lines = computed<CssProperties[]>(() => {
//   // if (nodeVertical.value.length === 0) return [];
//   const [left, right, center, top, bottom] = getVertical(props.modelValue);
//   const layout = rotateLayout(props.modelValue);
//   // const tree =
//   let Ls: CssProperties[] = [];
//   const l = trees.value.left.find(left[0], left[1]);
//   const r = trees.value.bottom.find(right[0], right[1]);
//   if (l && Math.abs(l[0] - left[0]) <= diff) {
//     let style = {
//       width: "3px",
//       height: `${left[1] - l[1]}px`,
//       transform: `translate(${l[0]}px, ${l[1]}px)`,
//     };
//     if (l[1] > left[1]) {
//       style.height = `${l[1] - bottom[1]}px`;
//       style.transform = `translate(${l[0]}px, ${bottom[1]}px)`;
//     }
//     Ls.push(style);
//   }
//   if (r && Math.abs(r[0] - r[0]) <= diff) {
//     Ls.push({
//       width: "3px",
//       height: `${r[1] - right[1]}px`,
//       transform: `translate(${r[0]}px, ${r[1]}px)`,
//     });
//   }
//   console.log(Ls);

//   return Ls;
// });
</script>
<template>
  <div v-for="line in lines" :style="line" :key="getId()" class="z-lines"></div>
</template>
<style scoped lang="scss">
.z-lines {
  position: absolute;
  background-color: rgb(var(--z-primary));
  z-index: 1000;
  top: 0;
  left: 0;
}
</style>
