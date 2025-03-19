<script setup lang="ts">
import {
  defineOptions,
  defineModel,
  watch,
  reactive,
  onUnmounted,
  defineAsyncComponent,
  ref,
  withDefaults,
  computed,
  nextTick,
  onMounted,
} from "vue";
const ZDragEditorCanvas = defineAsyncComponent(
  () => import("../ZDragEditorCanvas/ZDragEditorCanvas.vue")
);
const ZToolbar = defineAsyncComponent(() => import("../ZToolbar/ZToolbar.vue"));
const ZTextField = defineAsyncComponent(
  () => import("../ZTextField/ZTextField.vue")
);
const ContextMenu = defineAsyncComponent(
  () => import("../ZContextMenu/ZContextMenu.vue")
);
const ZSplitter = defineAsyncComponent(
  () => import("../ZSplitter/ZSplitter.vue")
);
const ZScaleController = defineAsyncComponent(
  () => import("@/components/ZScaleController/ZScaleController.vue")
);
const ZBtn = defineAsyncComponent(() => import("@/components/ZBtn/ZBtn.vue"));
const ZSvgIcon = defineAsyncComponent(
  () => import("@/components/ZSvgIcon/ZSvgIcon.vue")
);
const ZDrag = defineAsyncComponent(() => import("../ZDrag/ZDrag.vue"));
const ZNode = defineAsyncComponent(() => import("../ZNode/ZNode.vue"));
// const ZLines = defineAsyncComponent(() => import("../ZLines/ZLines.vue"));
import { calculateMousePosition } from "@/common/utils";
import type { ZLayout } from "@/common/types";
import type { ZDragNode } from "@/common/type";
import type {
  ZDragEditorModel,
  ZNodeMap,
  ZOption,
  ZCanvasContextMenuItem,
} from "./types";
defineOptions({
  name: "ZDragEditor",
});
const store = defineModel<ZDragEditorModel>({
  required: true,
  default: () => ({
    nodes: [],
    canvas: {
      width: window.innerWidth,
      height: window.innerHeight,
      scale: 0.8,
      drag: false,
      scroll: {
        left: 0,
        top: 0,
      },
    },
    active: undefined,
    moving: false,
    components: [],
  }),
});
const props = withDefaults(
  defineProps<{
    option: Partial<ZOption>;
  }>(),
  {
    option: () => ({}),
  }
);
const withOption = computed(() =>
  Object.assign(
    {
      lines: {
        color: "primary",
        diff: 3,
        interval: 8,
      },
      canvasContextMenu: {
        items: [
          {
            label: "重命名",
            action: (node: ZDragNode) => console.log("重命名", node),
            icon: "",
          },
          {
            label: "复制",
            action: (node: ZDragNode) => console.log("复制", node),
          },
          {
            label: "删除",
            action: (node: ZDragNode) => console.log("删除", node),
            icon: "",
            disabled: false,
          },
        ],
        clickClose: true,
      },
    },
    props.option
  )
);
const canvasRef = ref<InstanceType<typeof ZDragEditorCanvas> | null>(null);
const nodeMap = reactive<ZNodeMap>(new Map());
const prefixId = computed(() => Array.from(nodeMap.keys()).join("-"));
watch(
  () => store.value.nodes,
  (val) => {
    const recursive = (node: ZDragNode) => {
      nodeMap.set(node.id, node);
      if (node.children?.length) {
        node.children.forEach((child) => recursive(child));
      }
    };
    val.forEach((node) => recursive(node));
    const length = val.length;
    let maxW = Math.max(...val.map((i) => i.layout.width));
    let maxH = Math.max(...val.map((i) => i.layout.height));
    store.value.canvas.width = maxW * 10;
    store.value.canvas.height = maxH * Math.round(length / 10);
    let initStart = 50;
    let startX = initStart;
    let y = 50;
    val.forEach((node, i) => {
      if (i % 10 === 0) {
        startX = initStart;
        y += maxH + 50;
      }
      node.layout.x = startX + 50;
      node.layout.y = y;
      startX += node.layout.width + 50;
    });
  },
  {
    immediate: true,
    once: true,
  }
);
const change = (node?: ZDragNode) => {
  store.value.active = node;
};
onMounted(() => {});
onUnmounted(() => {
  nodeMap.clear();
});
const addPage = () => {};
const addNode = () => {};
const drop = (event: DragEvent) => {
  event.preventDefault();
  event.stopPropagation();
  let dt = event.dataTransfer;
  const str = dt?.getData("component");
  if (!str) return false;
  let com = JSON.parse(str) as ZDragNode;
  com.id = prefixId.value + "-" + Math.round(Math.random() * 100 + 1);
  const dom = event.target as HTMLElement;
  const { type, id } = dom.dataset;
  if (canvasRef.value && canvasRef.value.infiniteCanvas) {
    const canvas = canvasRef.value.infiniteCanvas;
    const { x, y } = calculateMousePosition(
      event,
      canvas,
      store.value.canvas.scale
    );
    if (type === "page" && id) {
      const parent = nodeMap.get(id);
      if (parent) {
        com.parentId = parent.id;
        com.relativeCanvas = parent.id;
        parent.children = parent.children || [];
        com.layout.x = Math.round(x) - parent.layout.x - com.layout.width / 2;
        com.layout.y = Math.round(y) - parent.layout.y - com.layout.height / 2;
        parent.children.push(com);
        return;
      }
    }
    com.relativeCanvas = "canvas";
    com.layout.x = Math.round(x) - com.layout.width / 2;
    com.layout.y = Math.round(y) - com.layout.height / 2;
    store.value.nodes.push(com);
  }
};
const dragenter = (event: DragEvent) => {
  event.preventDefault();
};
const dragover = (event: DragEvent) => {
  event.preventDefault();
};
const itemDragstart = (event: DragEvent, com: ZDragNode) => {
  let dt = event.dataTransfer;
  dt?.setData("component", JSON.stringify(com));
};
const itemDragend = (event: DragEvent) => {
  event.preventDefault();
};
const moveStart = () => {
  store.value.moving = true;
};
const moveEnd = () => {
  store.value.moving = false;
  if (!store.value.active) return;
  const node = store.value.active;
  if (node.type === "page") return;
  const { x, y, width, height } = store.value.active.layout;
  if (!node.parentId) {
    const nodes = store.value.nodes.filter(
      (i) => i.id !== node.id && i.type === "page"
    );
    nodes.forEach((n) => {
      const page = nodeMap.get(n.id);
      if (!page) return;
      const pageLo = page.layout;
      if (
        pageLo.x < x &&
        pageLo.y < y &&
        pageLo.x + pageLo.width > x + width &&
        pageLo.y + pageLo.height > y + height
      ) {
        const children = page.children || [];
        node.parentId = page.id;
        node.relativeCanvas = page.id;
        page.children = [...children, node];
        const filterNode = store.value.nodes.filter((c) => {
          return c.id !== node.id;
        });
        store.value.nodes = filterNode;
        node.layout.x = x - pageLo.x;
        node.layout.y = y - pageLo.y;
        change(node);
        nextTick(() => {});
        return true;
      } else return false;
    });
  } else {
    const parent = nodeMap.get(node.parentId);
    if (parent && parent.type === "page") {
      const parentLo = parent.layout;
      if (
        (x < 0 && Math.abs(x) >= width) ||
        (y < 0 && Math.abs(y) >= height) ||
        x > parentLo.width ||
        y > parentLo.height
      ) {
        let children = parent.children || [];
        parent.children = children.filter((i) => i.id !== node.id);
        node.parentId = undefined;
        node.relativeCanvas = "canvas";
        store.value.nodes.push(node);
        node.layout.x = parentLo.x + node.layout.x;
        node.layout.y = parentLo.y + node.layout.y;
        change(node);
        nextTick(() => {});
      }
    }
  }
};
const dblclick = (parent: ZDragNode, event: MouseEvent) => {
  if (!parent.children) return;
  console.dir(parent);
  let x = event.layerX;
  let y = event.layerY;
  if (parent.relativeCanvas !== "canvas") {
    const canvas = nodeMap.get(parent.relativeCanvas);
    if (!canvas) return;
    x = x - canvas.layout.x;
    y = y - canvas.layout.y;
  } else if (parent.relativeCanvas === "canvas" && parent.type === "page") {
    x = x - parent.layout.x;
    y = y - parent.layout.y;
  }
  let start = 0;
  let end = parent.children.length - 1;
  let ns: ZDragNode[] = [];
  while (start < end && end > start) {
    let bs = [parent.children[start++], parent.children[end--]];
    bs.forEach((cur) => {
      if (
        cur.layout.x <= x &&
        cur.layout.x + cur.layout.width >= x &&
        cur.layout.y <= y &&
        cur.layout.y + cur.layout.height >= y
      ) {
        ns.push(cur);
      }
    });
  }
  if (ns.length) {
    let index = 0;
    ns.forEach((n, i) => {
      if (!ns[i - 1]) return;
      if (n.layout.zIndex > ns[i - 1].layout.zIndex) index = i;
    });
    change(ns[index]);
  }
};
const layout = computed({
  get() {
    if (store.value.active?.relativeCanvas === "canvas")
      return store.value.active?.layout;
    else {
      if (!nodeMap.has(store.value.active?.relativeCanvas as string))
        return {} as ZLayout;
      const canvas = nodeMap.get(store.value.active?.relativeCanvas as string);
      if (!store.value.active) return {} as ZLayout;
      const nodeLayout = store.value.active.layout;
      if (!canvas) return {} as ZLayout;
      return {
        ...nodeLayout,
        x: canvas.layout.x + nodeLayout.x,
        y: canvas.layout.y + nodeLayout.y,
      };
    }
  },
  set(val) {
    if (!store.value.active) return;
    if (store.value.active.relativeCanvas === "canvas") {
      console.log("update  layout > canvas", store.value.active.layout);
      store.value.active.layout = val;
    } else {
      const canvas = nodeMap.get(store.value.active?.relativeCanvas as string);
      if (!canvas) return;
      console.log("update  layout > page", store.value.active.layout);
      store.value.active.layout = {
        ...val,
        x: val.x - canvas.layout.x,
        y: val.y - canvas.layout.y,
      };
    }
    console.log("update layout", store.value.active.layout);
  },
});
const contextMenuItemHandle = (
  node: ZCanvasContextMenuItem,
  closeMenu: () => void
) => {
  node.action(store.value.active, closeMenu);
};
</script>
<template>
  <article tabindex="0" class="ZDragEditor">
    <template v-if="!$slots.toolbar">
      <ZToolbar class="toolbar" v-model:store="store">
        <template #left="scope">
          <slot v-if="$slots['toolbar-left']" name="left" v-bind="scope"></slot>
          <template v-else>
            <h1 class="z-logo">ZDragEditor</h1>
          </template>
        </template>
        <template #center="scope">
          <slot
            v-if="$slots['toolbar-center']"
            name="center"
            v-bind="scope"
          ></slot>
          <template v-else>
            <div class="z-toolbar-center-btns">
              <ZBtn
                @click="scope.store.canvas.drag = !scope.store.canvas.drag"
                :color="
                  !scope.store.canvas.drag ? 'text-primary' : 'text-default'
                "
                :padding="false"
              >
                <ZSvgIcon size="md" name="cursor"></ZSvgIcon>
              </ZBtn>
              <ZBtn
                @click="scope.store.canvas.drag = !scope.store.canvas.drag"
                :color="
                  scope.store.canvas.drag ? 'text-primary' : 'text-default'
                "
                :padding="false"
              >
                <ZSvgIcon size="sm" name="grab"></ZSvgIcon>
              </ZBtn>
            </div>
          </template>
        </template>
        <template #right="scope">
          <slot
            v-if="$slots['toolbar-right']"
            name="right"
            v-bind="scope"
          ></slot>
          <template v-else>
            <ZScaleController
              v-model="scope.store.canvas.scale"
            ></ZScaleController>
          </template>
        </template>
      </ZToolbar>
    </template>
    <slot name="toolbar" :store="store"></slot>
    <ZSplitter v-if="!$slots.default" class="z-splitter">
      <template #left>
        <div v-if="!$slots.left" class="z-left-content">
          <ul class="drag-menu">
            <li
              @dragstart="itemDragstart($event, com)"
              @dragend="itemDragend"
              draggable="true"
              v-for="(com, i) in store.components"
              :tabindex="-i"
              :key="com.id"
              class="drag-menu-item"
            >
              {{ com.label }}
            </li>
          </ul>
        </div>
        <slot name="left" :store="store"></slot>
      </template>
      <template #center>
        <div v-if="!$slots.center" class="z-main-content">
          <ContextMenu
            :click-close="withOption.canvasContextMenu?.clickClose ?? true"
          >
            <template #default="{ closeMenu }">
              <ul
                v-if="!$slots['canvas-context-menu']"
                class="z-canvas-context-menu"
              >
                <li
                  v-for="(item, i) in withOption.canvasContextMenu?.items ?? []"
                  :key="i"
                  class="z-canvas-context-menu-item"
                  @click="contextMenuItemHandle(item, closeMenu)"
                >
                  <div v-if="item.icon" class="z-canvas-context-menu-item-icon">
                    <ZSvgIcon size="sm" :name="item.icon"></ZSvgIcon>
                  </div>
                  <span class="z-canvas-context-menu-item-label">
                    {{ item.label }}
                  </span>
                </li>
              </ul>
              <slot
                name="canvas-context-menu"
                :store="store"
                :nodeMap="nodeMap"
                :closeMenu="closeMenu"
              ></slot>
            </template>
          </ContextMenu>
          <ZDragEditorCanvas
            v-model:scale="store.canvas.scale"
            v-model:size="store.canvas"
            :hidden-scroll="false"
            @mousedown="change()"
            v-model:scroll="store.canvas.scroll"
            class="z-canvas"
            ref="canvasRef"
            :drag="store.canvas.drag"
            @drop="drop"
            @dragenter="dragenter"
            @dragover="dragover"
          >
            <template #default="{ canvas }">
              <div style="position: absolute; top: 0; left: 0">
                <ZDrag
                  v-if="store.active"
                  v-model="layout"
                  @dblclick="dblclick(store.active, $event)"
                  @before-move="moveStart"
                  @after-move="moveEnd"
                  position="absolute"
                  :container="(canvas as HTMLElement)"
                  :scale="store.canvas.scale"
                  :active="Boolean(store.active)"
                  :rotate="store.active.rotate"
                >
                </ZDrag>
              </div>
              <ZNode
                v-for="(node, index) in store.nodes"
                :key="node.id"
                v-model:store="store"
                v-model="store.nodes[index]"
                :container="(canvas as HTMLElement)"
                @mousedown.stop="change(node)"
                :option="withOption"
                @moveEnd="moveEnd"
                v-model:nodeMap="nodeMap"
              ></ZNode>
            </template>
          </ZDragEditorCanvas>
        </div>
        <slot name="center" :store="store"></slot>
      </template>
      <template #right>
        <div v-if="!$slots.right" class="z-right-content">
          <div v-if="store.active">
            <div class="row">
              <ZTextField
                class="col"
                :model-value="store.active.layout.x"
                label="X"
                placeholder="x轴坐标"
                required
              />
              <ZTextField
                class="col"
                :model-value="store.active.layout.y"
                label="Y"
                placeholder="Y轴坐标"
                required
              />
              <ZTextField
                class="col"
                :model-value="store.active.layout.rotate"
                label="°"
                placeholder="Y轴坐标"
                required
              />
            </div>
            <div class="row">
              <ZTextField
                class="col"
                :model-value="store.active.layout.width"
                label="宽"
                placeholder="x轴坐标"
                required
              />
              <ZTextField
                class="col"
                :model-value="store.active.layout.height"
                label="高"
                placeholder="Y轴坐标"
                required
              />
            </div>
          </div>
        </div>
        <slot name="right" :store="store"></slot>
      </template>
    </ZSplitter>
    <slot name="default"></slot>
  </article>
</template>
<style scoped lang="scss">
.ZDragEditor {
  overflow: hidden;
  box-sizing: border-box;
  .z-splitter {
    height: calc(100% - 50px);
  }
  .z-canvas {
    width: 100%;
    height: 100%;
  }
  .z-toolbar-center-btns {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  .z-logo {
    margin: 0;
    font-size: var(--z-font-xl);
    padding: 4px 8px;
    &:hover {
      color: rgba(var(--z-primary), 1);
      cursor: pointer;
    }
  }
  .z-left-content {
    padding: 8px 16px;
  }
  .z-main-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .z-right-content {
    padding: 8px 16px;
  }
}
.drag-menu {
  margin: 0;
  list-style: none;
  padding: 4px 8px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  .drag-menu-item {
    min-width: 50px;
    width: 70px;
    min-height: 50px;
    height: 70px;
    border: 1px solid rgb(var(--z-quiet));
    border-radius: 8px;
    background-color: rgba(var(--z-quiet), 0.3);
    transition: all 0.1s ease;
    &:hover {
      cursor: grab;
      background-color: rgba(var(--z-quiet), 0.6);
    }
    &:active {
      cursor: grabbing;
      background-color: rgba(var(--z-quiet), 1);
      user-select: none;
    }
  }
}
.z-canvas-context-menu {
  list-style: none;
  min-width: 160px;
  padding: 8px 4px;
  margin: 0;
  border: 1px solid rgba(var(--z-quiet), 0.6);
  border-radius: 8px;
  box-shadow: 0px 4px 10px 0px rgba(var(--z-quiet), 0.6);
  background: rgba(var(--z-page), 0.9);
  backdrop-filter: blur(8px);
  .z-canvas-context-menu-item {
    padding: 8px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(var(--z-text), 0.9);
    transition: all 0.2s ease;
    &:hover:not(.disabled) {
      background: rgba(var(--z-primary), 0.1);
      color: rgba(var(--z-primary), 1);
    }
    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .z-canvas-context-menu-item-icon {
      width: 16px;
      height: 16px;
    }
    .z-canvas-context-menu-item-label {
      font-size: var(--z-font-sm);
      font-family: system-ui;
    }
  }
}
</style>
