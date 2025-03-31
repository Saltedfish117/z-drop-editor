<script setup lang="ts">
// import ZDragEditor from "./components/ZDragEditor/ZDragEditor.vue";
import { ref } from "vue";
import ZDragEditor from "@/components/ZDragEditor/ZDragEditor.vue";
// import type { ZDragNodes, ZCanvasList } from "@/common/type";
// import { getId } from "@/common/utils";
// import { createCanvas, createNode } from "@/common/create";
// import ZTextField from "./components/ZTextField/ZTextField.vue";

// const initArr = Array.from({ length: 1 }, (_, _c) => {
//   const canvasId = getId();
//   let pageX = 0;
//   return createCanvas(canvasId, {
//     children: Array.from({ length: 1 }, (_, _p) => {
//       const pageId = getId();
//       let nodeX = 0;
//       const page = createNode({
//         id: pageId,
//         relative: "canvasId",
//         canvasId,
//         parentId: canvasId,
//         component: "page",
//         label: "page",
//         type: "page",
//         layout: {
//           width: 794,
//           height: 1123,
//           x: pageX,
//         },
//         hasRotate: false,
//         children: Array.from({ length: 3 }, (_, _n) => {
//           const nodeId = getId();
//           const node = createNode({
//             id: nodeId,
//             relative: "pageId",
//             component: "rectangle",
//             parentId: pageId,
//             label: "node",
//             canvasId,
//             pageId,
//             type: "component",
//             layout: {
//               x: nodeX,
//             },
//           });
//           nodeX += 210;
//           return node;
//         }) as ZDragNodes,
//       });
//       pageX += page.layout.width + 50;
//       return page;
//     }),
//   });
// }) as ZCanvasList;
// let nodeX = 0;
// let groupId = getId();
// initArr[0].children[0].children?.push(
//   createNode({
//     id: groupId,
//     canvasId: initArr[0].id,
//     pageId: initArr[0].children[0].id,
//     parentId: initArr[0].children[0].id,
//     component: "group",
//     label: "group",
//     type: "group",
//     layout: {
//       x: 0,
//       y: 0,
//       width: 200,
//       height: 200,
//       rotate: 0,
//       zIndex: 1,
//       lock: false,
//     },
//     hasRotate: false,
//     relative: "pageId",
//     children: Array.from({ length: 3 }, (_, __) => {
//       const nodeId = getId();
//       const node = createNode({
//         id: nodeId,
//         relative: "pageId",
//         component: "rectangle",
//         label: "node",
//         canvasId: initArr[0].id,
//         pageId: initArr[0].children[0].id,
//         parentId: groupId,
//         type: "component",
//         layout: {
//           x: nodeX,
//           y: 220,
//         },
//       });
//       nodeX += 210;
//       return node;
//     }) as ZDragNodes,
//   })
// );
// const canvasList = ref(initArr);
const components = [
  {
    id: `-kids`,
    component: "rectangle",
    label: "矩形",
    parentId: "",
    layout: {
      x: 0,
      y: 0,
      width: 200,
      height: 200,
      rotate: 0,
      zIndex: 1,
      lock: false,
    },
    type: "component",
  },
];
const canvases = ref([]);
</script>
<template>
  <article>
    <!--       <!-- <template #contextMenu>
        <div class="context-menu">context-menu</div>
      </template>
      <template #right="{ selectNode }">
        <div class="z-right-content">
          <div v-if="selectNode">
            <div class="text-field-row">
              <ZTextField
                class="col"
                :model-value="selectNode.layout.x"
                placeholder="x轴坐标"
              >
                <template #prefix>X</template>
              </ZTextField>
              <ZTextField
                class="col"
                :model-value="selectNode.layout.y"
                label="Y"
                placeholder="Y轴坐标"
              >
                <template #prefix>Y</template>
              </ZTextField>
              <ZTextField
                class="col"
                :model-value="selectNode.layout.rotate"
                placeholder="旋转角度"
                prefix-icon="shuaxin"
              >
              </ZTextField>
              <ZTextField class="col" :model-value="selectNode.layout.width">
                <template #prefix>W</template>
              </ZTextField>
              <ZTextField class="col" :model-value="selectNode.layout.height">
                <template #prefix>H</template>
              </ZTextField>
            </div>
          </div>
        </div>
      </template> -->
    <ZDragEditor :components="components" :canvases="canvases" class="editor">
    </ZDragEditor>
  </article>
</template>
<style scoped lang="scss">
.editor {
  width: 100vw;
  height: 100vh;
}
// .context-menu {
//   background-color: rgb(255, 255, 255);
//   border: 1px solid #ccc;
//   padding: 8px;
//   border-radius: 4px;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
// }
// .z-right-content {
//   height: 100%;
//   width: 100%;
//   .text-field-row {
//     padding: 8px 16px;
//     display: grid;
//     grid-template-columns: repeat(3, 1fr);
//     gap: 4px;
//     flex-wrap: wrap;
//     .col {
//       min-width: 50px;
//       // width: 33.33%;
//       font-size: 12px;
//     }
//   }
// }
</style>
