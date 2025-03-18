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
const ZLines = defineAsyncComponent(() => import("../ZLines/ZLines.vue"));
import { calculateMousePosition } from "@/common/utils";
import type { ZNode as Node, ZNode } from "../ZNode/types";
import type { ZDragEditorModel, ZNodeMap, ZOption } from "./types";
import type { Layout } from "../ZDrag/types";
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
    option: () => ({
      lines: {
        color: "primary",
        diff: 3,
        interval: 8,
      },
    }),
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
    },
    props.option
  )
);
const canvasRef = ref<InstanceType<typeof ZDragEditorCanvas> | null>(null);
const nodeMap = reactive<ZNodeMap>(new Map());
const prefixId = computed(() => Array.from(nodeMap.keys()).join("-"));
const scaleFactor = computed(() => 1 / store.value.canvas.scale);
watch(
  () => store.value.nodes,
  (val) => {
    const recursive = (node: Node) => {
      nodeMap.set(node.id, node);
      if (node.children?.length) {
        node.children.forEach((child) => recursive(child));
      }
    };
    val.forEach((node) => recursive(node));
    const length = val.length;
    // let nodesWidth =
    //   val.reduce((prev, curr) => (prev += curr.layout.width), 0) +
    //   50 * val.length;
    let maxW = Math.max(...val.map((i) => i.layout.width));
    let maxH = Math.max(...val.map((i) => i.layout.height));
    store.value.canvas.width = maxW * 10;
    store.value.canvas.height = maxH * Math.round(length / 10);
    // if (length > 10) store.value.canvas.scale = 0.5;
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
    // store.value.canvas.width = Math.round(nodesWidth * 3);
    // store.value.canvas.height = maxHeight * Math.round(length / 10);
    // // console.log(store.value.canvas.height);
    // let initStart = Math.round(store.value.canvas.width / 2 - nodesWidth / 2);
    // let startX = initStart;
    // let y = Math.round(store.value.canvas.height / 2 - maxHeight);
    // val.forEach((node, i) => {
    //   // 逢十换行
    //   if (i % 10 === 0) {
    //     startX = initStart;
    //     y += maxHeight + 50;
    //   }
    //   node.layout.x = startX + 50;
    //   startX += node.layout.width + 50;
    //   node.layout.y = y;
    //   recursive(node);
    // });
  },
  {
    immediate: true,
    once: true,
  }
);
const change = (node?: Node) => {
  store.value.active = node;
};
const zoomOut = () => {
  if (store.value.canvas.scale - 0.1 < 0.1) return;
  store.value.canvas.scale = Number.parseFloat(
    (store.value.canvas.scale - 0.1).toFixed(1)
  );
};
const zoomIn = () => {
  if (store.value.canvas.scale + 0.1 > 5) return;
  store.value.canvas.scale = Number.parseFloat(
    (store.value.canvas.scale + 0.1).toFixed(1)
  );
};
const mousewheel = (e: WheelEvent) => {
  // 判断是不是按下ctrl键
  if (e.ctrlKey) {
    // 取消浏览器默认的放大缩小网页行为
    e.preventDefault();
    // 判断是向上滚动还是向下滚动
    if (e.deltaY > 0) {
      // 缩小重写，业务代码
      zoomOut();
    } else {
      // 放大重写，业务代码
      zoomIn();
    }
  }
};
onMounted(() => {
  store.value.canvas.scroll.left =
    (store.value.nodes[0].layout.x + store.value.nodes[0].layout.width) /
    scaleFactor.value;
  store.value.canvas.scroll.top =
    store.value.nodes[0].layout.y / scaleFactor.value;
});
onUnmounted(() => {
  nodeMap.clear();
});
const menuItems = [
  {
    label: "重命名",
    action: (node: Node) => console.log("重命名", node),
    icon: "",
  },
  {
    label: "删除",
    action: (node: Node) => console.log("删除", node),
    icon: "",
    disabled: false,
  },
  {
    label: "复制",
    action: (node: Node) => console.log("复制", node),
  },
];
const drop = (event: DragEvent) => {
  event.preventDefault();
  event.stopPropagation();
  let dt = event.dataTransfer;
  const str = dt?.getData("component");
  if (!str) return false;
  let com = JSON.parse(str) as ZNode;
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
const itemDragstart = (event: DragEvent, com: Node) => {
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
const dblclick = (parent: Node, event: MouseEvent) => {
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
  let ns: Node[] = [];
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
  console.log(ns);
  if (ns.length) {
    let index = 0;
    ns.forEach((n, i) => {
      if (!ns[i - 1]) return;
      if (n.layout.zIndex > ns[i - 1].layout.zIndex) index = i;
    });
    change(ns[index]);
  }
  // let node = parent.children.reduce((pre: ZNode, cur: ZNode) => {
  //   if (
  //     cur.layout.x <= x &&
  //     cur.layout.x + cur.layout.width >= x &&
  //     cur.layout.y <= y &&
  //     cur.layout.y + cur.layout.height >= y
  //   ) {
  //     if (!pre) return cur;
  //     if (cur.layout.zIndex > pre.layout.zIndex) {
  //       return cur;
  //     } else {
  //       return pre;
  //     }
  //   } else {
  //     return pre;
  //   }
  // });
  // if (node) {
  //   console.log(node);
  //   change(node);
  // }
};
const layout = computed({
  get() {
    if (store.value.active?.relativeCanvas === "canvas")
      return store.value.active?.layout;
    else {
      if (!nodeMap.has(store.value.active?.relativeCanvas as string))
        return {} as Layout;
      const canvas = nodeMap.get(store.value.active?.relativeCanvas as string);
      if (!store.value.active) return {} as Layout;
      const nodeLayout = store.value.active.layout;
      if (!canvas) return {} as Layout;
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
      store.value.active.layout = val;
    } else {
      const canvas = nodeMap.get(store.value.active?.relativeCanvas as string);
      if (!canvas) return;
      // console.log(val);
      // const nodeLayout = store.value.active.layout;
      Object.assign(store.value.active.layout, {
        ...val,
        x: val.x - canvas.layout.x,
        y: val.y - canvas.layout.y,
      });
      // console.log(store.value.active.layout);
    }
  },
});
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
          <ContextMenu :menuItems="menuItems"></ContextMenu>
          <ZDragEditorCanvas
            @mousewheel="mousewheel"
            :scale="store.canvas.scale"
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
              <!-- <ZDrag
                v-if="active"
                v-model="active.layout"
                @dblclick="dblclick(active, $event)"
                @after-move="moveEnd"
                position="absolute"
                :container="(canvas as HTMLElement)"
                :scale="store.canvas.scale"
                :active="Boolean(active)"
                :rotate="active.rotate"
              >
              </ZDrag>
              <ZLines
                v-if="withOption.lines"
                v-model="active"
                :diff="withOption.lines.diff"
                :interval="withOption.lines.interval"
                :color="withOption.lines.color"
                :nodes="store.nodes"
                :moving="Boolean(active)"
              ></ZLines> -->
              <ZNode
                @drop="drop"
                @dragenter="dragenter"
                @dragover="dragover"
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
</style>
