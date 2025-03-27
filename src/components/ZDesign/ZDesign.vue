<script setup lang="ts">
import {
  defineOptions,
  defineModel,
  ref,
  computed,
  onMounted,
  watch,
  onUnmounted,
  nextTick,
} from "vue";
import ZBtn from "../ZBtn/ZBtn.vue";
import ZSvgIcon from "../ZSvgIcon/ZSvgIcon.vue";
import { createCanvas, createNode } from "@/common/create";
import { getId } from "@/common/utils";
import ZTree from "../ZTree/ZTree.vue";
import ZPageList from "../ZPageList/ZPageList.vue";
import ZPopup from "../ZPopup/ZPopup.vue";
// import ZCanvasList from "../ZCanvasList/ZCanvasList.vue";
import type { ZCanvasList, ZCanvas, ZDragNode, ZMap } from "@/common/type";
import ZTextField from "../ZTextField/ZTextField.vue";
import type { ZTreeNode } from "../ZTree/type";
defineOptions({
  name: "ZDesign",
  directives: {
    "auto-focus": {
      updated(el) {
        const child = el.querySelector("input");
        child.focus();
        // child.select();
      },
    },
  },
});
interface CanvasItem extends ZCanvas {
  editor: boolean;
}
type CanvasList = CanvasItem[];
const canvas = defineModel<CanvasList>("canvas", {
  required: true,
});
const selectCanvas = defineModel<CanvasItem>("selectCanvas", {
  required: true,
});
const selectNode = defineModel<ZDragNode>("selectNode");
const treeMap = defineModel<ZMap>("treeMap");
const select = (canvasItem: CanvasItem) => {
  selectCanvas.value = canvasItem;
  selectNode.value = undefined;
};
const tabs = ref([
  {
    label: "页面",
    name: "page",
  },
  {
    label: "结构",
    name: "nodes",
  },
]);
const selectTab = ref("page");
const filterPage = ref("");
const pages = computed(() => {
  const p = selectCanvas.value.children?.filter((item) => item.type === "page");
  if (filterPage.value === "") return p;
  else
    return p.filter((item) => {
      if (item.label) {
        return item.label.includes(filterPage.value);
      } else return false;
    });
});
const tabItemRefs = ref<HTMLElement[]>([]);
const tabSlider = ref({
  width: 0,
  height: 0,
  x: 0,
  y: 0,
});
const observe = ref<InstanceType<typeof ResizeObserver> | null>(null);
const createObserver = (target: HTMLElement) => {
  observe.value = new ResizeObserver((entries) => {
    for (let entry of entries) {
      const targetElement = entry.target as HTMLElement;
      tabSlider.value.width = targetElement.offsetWidth;
      tabSlider.value.height = targetElement.offsetHeight;
      tabSlider.value.x = targetElement.offsetLeft;
      tabSlider.value.y = targetElement.offsetTop;
    }
  });
  observe.value.observe(target);
};
const clearObserver = () => {
  if (!observe.value) return;
  observe.value.disconnect();
  observe.value = null;
};
const addCanvas = () => {
  canvas.value.push(createCanvas("canvas-" + getId()));
};
const removeCanvas = (id: string) => {
  if (canvas.value.length === 1) return;
  let newCanvasList = canvas.value.filter((i) => i.id !== id);
  canvas.value = newCanvasList;
  nextTick(() => {
    if (id === selectCanvas.value.id) {
      selectCanvas.value = canvas.value[0];
    }
  });
};
const setSelect = (item: ZDragNode) => {
  selectNode.value = item;
};
const removePage = (item: ZDragNode | ZCanvas, index: number) => {};
onUnmounted(() => {
  clearObserver();
});
watch(
  () => selectTab.value,
  () => {
    clearObserver();
    if (selectTab.value === "page") {
      createObserver(tabItemRefs.value[0]);
      tabSlider.value.width = tabItemRefs.value[0].offsetWidth;
      tabSlider.value.height = tabItemRefs.value[0].offsetHeight;
      tabSlider.value.x = tabItemRefs.value[0].offsetLeft;
      tabSlider.value.y = tabItemRefs.value[0].offsetTop;
    } else {
      createObserver(tabItemRefs.value[1]);
      tabSlider.value.width = tabItemRefs.value[1].offsetWidth;
      tabSlider.value.height = tabItemRefs.value[1].offsetHeight;
      tabSlider.value.x = tabItemRefs.value[1].offsetLeft;
      tabSlider.value.y = tabItemRefs.value[1].offsetTop;
    }
  }
);
const editorLabel = (item: CanvasItem, label: string = "") => {
  item.editor = false;
  if (!label.trim()) return;
  const node = treeMap.value?.get(item.id);
  if (node) {
    node.label = label;
  }
};
onMounted(() => {
  createObserver(tabItemRefs.value[0]);
  tabSlider.value.width = tabItemRefs.value[0].offsetWidth;
  tabSlider.value.height = tabItemRefs.value[0].offsetHeight;
  tabSlider.value.x = tabItemRefs.value[0].offsetLeft;
  tabSlider.value.y = tabItemRefs.value[0].offsetTop;
});
const pageRect = ref({
  width: 0,
  height: 0,
});
const submitCreatePage = (close: () => void) => {
  if (pageRect.value.width === 0 || pageRect.value.height === 0) return;
  const endPage = pages.value[pages.value.length - 1];
  const page = createNode({
    id: "page-" + getId(),
    component: "page",
    label: "页面 " + (pages.value.length + 1),
    type: "page",
    relative: "canvasId",
    canvasId: selectCanvas.value.id,
    layout: {
      width: pageRect.value.width,
      height: pageRect.value.height,
      x: endPage.layout.x + endPage.layout?.width + 20,
      y: endPage.layout.y,
    },
    children: [],
    hasRotate: false,
  });
  selectCanvas.value.children?.push(page);
  treeMap.value?.set(page.id, page);
  pageRect.value = {
    width: 0,
    height: 0,
  };
  close();
};
</script>
<template>
  <div class="z-design">
    <div class="z-design_top">
      <div class="canvas-header">
        <h6 class="title">画布</h6>
        <div>
          <ZBtn :padding="false" color="text-default">
            <!-- <ZPopup> 撒低级咖啡 </ZPopup> -->
            <ZSvgIcon size="sm" name="plus"></ZSvgIcon>
          </ZBtn>
        </div>
      </div>
      <ul class="canvas-list">
        <li
          class="z-canvas-list-item"
          v-for="item in canvas"
          :key="item.id"
          @click="select(item)"
          :class="{
            active: selectCanvas?.id === item.id,
          }"
          @dblclick="item.editor = true"
        >
          <span v-show="!item.editor">
            {{ item.label }}
          </span>
          <ZTextField
            v-show="item.editor"
            v-auto-focus
            :model-value="item.label"
            @blur="editorLabel(item, $event.target.value)"
          ></ZTextField>
          <ZBtn
            v-if="canvas.length !== 1"
            @click.stop="removeCanvas(item.id)"
            color="text-danger"
            :padding="false"
          >
            <ZSvgIcon name="shanchu_1" size="sm"></ZSvgIcon>
          </ZBtn>
        </li>
      </ul>
    </div>
    <div class="z-design_bottom">
      <div class="z-design-tabs">
        <div
          :style="{
            width: `${tabSlider.width}px`,
            height: `${tabSlider.height}px`,
            left: `${tabSlider.x}px`,
            top: `${tabSlider.y}px`,
          }"
          class="z-design-tabs-slider"
        ></div>
        <div
          class="z-design-tabs-item"
          v-for="item in tabs"
          :key="item.name"
          tabindex="-1"
          @click="selectTab = item.name"
          :class="{
            active: selectTab === item.name,
          }"
          ref="tabItemRefs"
        >
          {{ item.label }}
        </div>
      </div>
      <div class="z-design-tabs-content">
        <div class="z-design-page" v-show="selectTab === 'page'">
          <div class="z-design-page-form">
            <div class="textfield">
              <ZTextField v-model.trim="filterPage" placeholder="页面名称" />
            </div>
            <div class="icons">
              <ZBtn :padding="false" color="text-default">
                <ZPopup>
                  <template #default="{ close }">
                    <div class="row">
                      <ZTextField
                        class="textfield"
                        v-model.number="pageRect.width"
                        placeholder="宽度"
                      >
                        <template #prefix>W</template></ZTextField
                      >
                      <ZTextField
                        class="textfield"
                        v-model.number="pageRect.height"
                        placeholder="高度"
                      >
                        <template #prefix>H</template></ZTextField
                      >
                    </div>
                    <div
                      style="
                        margin-top: 4px;
                        display: flex;
                        justify-content: flex-end;
                        gap: 4px;
                      "
                    >
                      <ZBtn @click="close">取消</ZBtn>
                      <ZBtn color="primary" @click="submitCreatePage(close)">确定</ZBtn>
                    </div>
                  </template>
                </ZPopup>
                <ZSvgIcon size="sm" name="plus"></ZSvgIcon>
              </ZBtn>
            </div>
          </div>
          <ZPageList
            :list="pages as ZTreeNode[]"
            v-model:select="selectNode as ZTreeNode"
          ></ZPageList>
        </div>
        <div class="z-design-nodes" v-show="selectTab === 'nodes'">
          <ZTree
            v-model:nodes="selectCanvas.children as ZTreeNode[]"
            v-model:select="selectNode as ZTreeNode"
          ></ZTree>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.z-design {
  width: 100%;
  height: 100%;
  max-height: 100%;
  .z-design_top {
    width: 100%;
    min-height: 20%;
    height: 35%;
    max-height: 50%;
    display: flex;
    flex-direction: column;

    .canvas-header {
      padding: 4px 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 30px;
      .title {
        font-size: var(--z-font-sm);
        font-weight: 300;
        padding: 0;
        margin: 0;
      }
      box-shadow: 0px 3px 6px rgba(64, 87, 109, 0.1);
    }
    .canvas-list {
      list-style: none;
      padding: 8px 4px;
      margin: 0;
      background-color: rgba(var(--z-quiet), 0.1);
      flex: 1;
      max-height: calc(100% - 30px);
      overflow: auto;
      .z-canvas-list-item {
        padding: 4px 4px;
        // border-radius: 4px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: var(--z-font-sm);
        margin-bottom: 4px;
        box-shadow: 0px 3px 6px rgba(64, 87, 109, 0.1);
        // border: 1px solid rgb(var(--z-quiet));
        position: relative;
        background-color: rgba(var(--z-page), 1);
        user-select: none;
        &::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(
              to right,
              rgb(var(--z-primary)),
              rgb(var(--z-primary))
            )
            no-repeat right bottom;
          background-size: 0 1px;
          transition: background-size 1s;
          top: 0;
          left: 0;
        }
        &.active {
          &::before {
            background-position: left bottom;
            background-size: 100% 1px;
          }
        }
      }
    }
  }
  .z-design_bottom {
    width: 100%;
    height: 80%;
    max-height: 80%;
    display: flex;
    flex-direction: column;

    .z-design-tabs {
      position: sticky;
      top: 0;
      display: flex;
      gap: 6px;
      padding: 4px 8px;
      z-index: 1;
      background-color: rgba(var(--z-page), 1);
      box-shadow: 0px 3px 6px rgba(64, 87, 109, 0.1);
      max-height: 35px;
      .z-design-tabs-item {
        padding: 4px 8px;
        font-size: var(--z-font-sm);
        flex: 1;
        text-align: center;
        border-radius: 4px;
        cursor: pointer;
        user-select: none;
        &:not(.active):hover {
          box-shadow: 0 0 6px rgba(64, 87, 109, 0.1);
          //   background-color: rgb(var(--z-page));
          background-color: rgba(var(--z-quiet), 0.3);
          transition: all 0.3s ease;
          color: rgb(var(--z-primary));
        }
        &:not(.active):active {
          box-shadow: 0 0 6px rgba(64, 87, 109, 0.1);
          //   background-color: rgba(var(--z-page), 0.6);
          background-color: rgba(var(--z-quiet), 0.3);
          transform: scale(0.98);
          user-select: none;
          transition: all 0.3s ease;
          color: rgb(var(--z-primary));
        }
        &.active {
          color: rgb(var(--z-text-light));
        }
        z-index: 1;
      }
      .z-design-tabs-slider {
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgb(var(--z-primary));
        border-radius: 4px;
        transition: left 0.15s ease;
      }
    }
    .z-design-tabs-content {
      flex: 1;
      max-height: calc(100% - 35px);
      padding-top: 8px;
      overflow: auto;
      background-color: rgba(var(--z-quiet), 0.1);
    }
    .z-design-nodes {
      .z-design-nodes-form {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4px 8px;
        gap: 8px;
        .textfield {
          flex: 1;
          // input {
          //   width: 100%;
          //   box-sizing: border-box;
          //   outline: none;
          //   border-radius: 4px;
          //   border: 1px solid rgb(var(--z-quiet));
          //   font-size: var(--z-font-sm);
          //   padding: 4px 8px;
          //   &:focus {
          //     border: 1px solid rgb(var(--z-primary));
          //   }
          // }
        }
        .icons {
          min-width: 30px;
        }
      }
    }
    .z-design-page {
      .z-design-page-form {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4px 8px;
        gap: 8px;
        .textfield {
          flex: 1;
          input {
            width: 100%;
            box-sizing: border-box;
            outline: none;
            border-radius: 4px;
            border: 1px solid rgb(var(--z-quiet));
            font-size: var(--z-font-sm);
            padding: 4px 8px;
            &:focus {
              border: 1px solid rgb(var(--z-primary));
            }
          }
        }
        .icons {
          min-width: 30px;
        }
      }
    }
  }
}
.row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  .textfield {
    width: 80px;
    font-size: var(--z-font-xs);
  }
}
</style>
