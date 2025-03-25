<script setup lang="ts">
import ZDragEditor from "./components/ZDragEditor/ZDragEditor.vue";
import { reactive, ref } from "vue";
import type { ZDragNodes, ZCanvasList } from "@/common/type";
import { getId } from "@/common/utils";
import { createCanvas, createNode } from "@/common/create";
import ZTextField from "./components/ZTextField/ZTextField.vue";
import ZSvgIcon from "./components/ZSvgIcon/ZSvgIcon.vue";
const initArr = Array.from({ length: 2 }, (_, c) => {
  const canvasId = getId();
  let pageX = 0;
  return createCanvas(canvasId, {
    children: Array.from({ length: 2 }, (_, p) => {
      const pageId = getId();
      let nodeX = 0;
      const page = createNode({
        id: pageId,
        relative: "canvasId",
        canvasId,
        component: "page",
        label: "page",
        type: "page",
        layout: {
          width: 794,
          height: 1123,
          x: pageX,
        },
        rotate: false,
        children: Array.from({ length: 3 }, (_, n) => {
          const nodeId = getId();
          const node = createNode({
            id: nodeId,
            relative: "pageId",
            component: "rectangle",
            label: "node",
            canvasId,
            pageId,
            type: "component",
            layout: {
              x: nodeX,
            },
          });
          nodeX += 210;
          return node;
        }) as ZDragNodes,
      });
      pageX += page.layout.width + 50;
      return page;
    }),
  });
}) as ZCanvasList;
const canvasList = ref(initArr);
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
    rotate: true,
    type: "component",
  },
] as ZDragNodes;
</script>
<template>
  <article>
    <!--  -->
    <ZDragEditor :components="components" :canvas="canvasList" class="editor"
      ><template #right="{ selectNode }">
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
              <ZTextField
                class="col"
                :model-value="selectNode.layout.width"
                placeholder="x轴坐标"
              >
                <template #prefix>W</template>
              </ZTextField>
              <ZTextField
                class="col"
                :model-value="selectNode.layout.height"
                placeholder="Y轴坐标"
              >
                <template #prefix>H</template>
              </ZTextField>
            </div>
          </div>
        </div>
      </template>
    </ZDragEditor>
  </article>
</template>
<style scoped lang="scss">
.editor {
  width: 100vw;
  height: 100vh;
}
.z-right-content {
  height: 100%;
  width: 100%;
  .text-field-row {
    padding: 8px 16px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    flex-wrap: wrap;
    .col {
      min-width: 50px;
      // width: 33.33%;
      font-size: 12px;
    }
  }
}
</style>
