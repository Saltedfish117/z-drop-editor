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
  defineProps,
} from "vue";
import { quadtree, text } from "d3";
const ZDragEditorCanvas = defineAsyncComponent(
  () => import("../ZDragEditorCanvas/ZDragEditorCanvas.vue")
);
const ZToolbar = defineAsyncComponent(() => import("../ZToolbar/ZToolbar.vue"));
const ZMaterialList = defineAsyncComponent(
  () => import("../ZMaterialList/ZMaterialList.vue")
);
const ZDesign = defineAsyncComponent(() => import("../ZDesign/ZDesign.vue"));
const ZTextField = defineAsyncComponent(() => import("../ZTextField/ZTextField.vue"));
const ContextMenu = defineAsyncComponent(
  () => import("../ZContextMenu/ZContextMenu.vue")
);
const ZSplitter = defineAsyncComponent(() => import("../ZSplitter/ZSplitter.vue"));
const ZScaleController = defineAsyncComponent(
  () => import("@/components/ZScaleController/ZScaleController.vue")
);
const ZBtn = defineAsyncComponent(() => import("@/components/ZBtn/ZBtn.vue"));
const ZSvgIcon = defineAsyncComponent(() => import("@/components/ZSvgIcon/ZSvgIcon.vue"));
const ZDrag = defineAsyncComponent(() => import("../ZDrag/ZDrag.vue"));
const ZNode = defineAsyncComponent(() => import("../ZNode/ZNode.vue"));
import { calculateMousedownPosition, serializer, getId } from "@/common/utils";
import { createCanvas } from "@/common/create";
import type {
  ZDragNode,
  ZDragNodes,
  ZLayout,
  ZCanvasList,
  ZCanvas,
  ZMap,
} from "@/common/type";
defineOptions({
  name: "ZDragEditor",
});
interface ZMenuItem {
  icon: string;
  text: string;
  name: string;
  component: any;
}
type ZMenus = ZMenuItem[];
const props = withDefaults(
  defineProps<{
    components: ZDragNodes;
    customizeMenu?: boolean;
    menus?: ZMenus;
  }>(),
  {
    customizeMenu: false,
    menus: () => [],
  }
);
const withMenus = computed(() => {
  if (props.customizeMenu) {
    return props.menus;
  } else {
    return [
      {
        icon: "design",
        text: "设计",
        name: "design",
        component: ZDesign,
      },
      {
        icon: "material",
        text: "素材",
        name: "material",
        component: ZMaterialList,
      },
      ...props.menus,
    ];
  }
});
const selectMenu = ref(withMenus.value[0]);
const setSelectMenu = (menu: ZMenuItem) => {
  selectMenu.value = menu;
};
const canvas = defineModel<ZCanvasList>("canvas", {
  required: true,
});
if (canvas.value.length === 0) {
  canvas.value.push(createCanvas("1-canvas"));
}
const editorCanvasRef = ref<InstanceType<typeof ZDragEditorCanvas> | null>(null);
const selectCanvas = ref<ZCanvas>(canvas.value[0]);
const selectNode = ref<ZDragNode | undefined>();
const treeMap = reactive<ZMap>(new Map());
const hijackNodeAxis = computed({
  get() {
    if (!selectNode.value) return;

    if (selectNode.value && selectNode.value.relative) {
      const relative = selectNode.value.relative;
      const containerId = selectNode.value[relative];

      if (!containerId) throw new Error("relative container is not exist");
      console.log(treeMap.has(containerId));
      if (treeMap.has(containerId) && treeMap.get(containerId)!.type !== "canvas") {
        const container = treeMap.get(containerId)!;
        console.log(container);
        const hijack = { ...selectNode.value.layout };
        hijack.x = container.layout.x + hijack.x;
        hijack.y = container.layout.y + hijack.y;
        return hijack;
      } else {
        return selectNode.value.layout;
      }
    }
  },
  set(value: ZLayout) {
    if (!selectNode.value) return;
    if (selectNode.value && selectNode.value.relative) {
      const relative = selectNode.value.relative;
      const containerId = selectNode.value[relative];
      if (!containerId) throw new Error("relative container is not exist");
      if (treeMap.has(containerId) && treeMap.get(containerId)?.type !== "canvas") {
        const container = treeMap.get(containerId)!;
        selectNode.value.layout = {
          ...value,
          x: value.x - container.layout.x,
          y: value.y - container.layout.y,
        };
      } else {
        selectNode.value.layout = {
          ...value,
        };
      }
    }
  },
});
const initTreeMap = (val: ZDragNodes | ZCanvasList, nodeMap: ZMap) => {
  const recursive = (node: ZDragNode | ZCanvas, nodeMap: ZMap) => {
    nodeMap.set(node.id, node);
    if (node.children?.length) {
      node.children.forEach((child) => recursive(child, nodeMap));
    }
  };
  val.forEach((node) => recursive(node, nodeMap));
};
initTreeMap(selectCanvas.value.children, treeMap);
treeMap.set(selectCanvas.value.id, selectCanvas.value);
watch(
  () => selectCanvas.value,
  (val) => {
    if (val) {
      treeMap.clear();
      initTreeMap(selectCanvas.value.children, treeMap);
      treeMap.set(selectCanvas.value.id, selectCanvas.value);
    }
  }
);
const getSelectCanvas = () => {
  return selectCanvas.value;
};
const setSelectCanvas = (canvas: ZCanvas) => {
  selectCanvas.value = canvas;
};
const getSelectNode = () => {
  return selectNode.value;
};

const addNode = (
  event: { clientX: number; clientY: number },
  data: {
    containerId: string;
    container: HTMLElement;
    node: ZDragNode;
  }
) => {
  const { x, y } = calculateMousedownPosition(
    event,
    data.container,
    selectCanvas.value.layout.scale
  );
  const container = treeMap.get(data.containerId);
  console.log("drop", container);
  if (!container) return;
  const node = { ...data.node };
  node.id = getId();
  const addMode = {
    canvas: () => {
      node.relative = "canvasId";
      node.canvasId = container.id;
      node.layout = {
        ...node.layout,
        x,
        y,
      };
      node.parentId = container.id;
      const children = container.children || [];
      children.push(node);
      container.children = children;
    },
    page: () => {
      node.relative = "pageId";
      node.canvasId = selectCanvas.value.id;
      node.pageId = container.id;
      node.layout = {
        ...node.layout,
        x: x,
        y: y,
      };
      node.parentId = container.id;
      const children = container.children || [];
      children.push(node);
      container.children = children;
    },
  };
  addMode[container.type as keyof typeof addMode]();
  treeMap.set(node.id, node);
};
const beforeMove = (event: MouseEvent) => {};
const afterMove = (event: MouseEvent) => {
  if (!selectNode.value) return;
  const node = selectNode.value;
  if (node.type === "page") return;
  const { x, y, width, height } = node.layout;
  const moveEndMode = {
    pageId: () => {
      if (!node.canvasId) throw new Error("canvasId is not exist");
      const canvas = treeMap.get(node.canvasId)!;
      if (!node.pageId) throw new Error("canvasId is not exist");
      const page = treeMap.get(node.pageId)!;
      if (
        (x < 0 && Math.abs(x) >= width) ||
        (y < 0 && Math.abs(y) >= height) ||
        x > page.layout.width ||
        y > page.layout.height
      ) {
        node.relative = "canvasId";
        delete node.pageId;
        node.parentId = canvas.id;
        node.layout = {
          ...node.layout,
          x: x + page.layout.x,
          y: y + page.layout.y,
        };
        let pageChildren = page.children ?? [];
        pageChildren = pageChildren.filter((n) => n.id !== node.id);
        page.children = pageChildren;
        canvas.children?.push(node);
      }
    },
    canvasId: () => {
      if (!node.canvasId) throw new Error("canvasId is not exist");
      const canvas = selectCanvas.value!;
      const pages = canvas!.children!.filter((n) => n.type === "page");
      if (!pages.length) return;
      const tree = quadtree()
        .x((p) => p.layout.x)
        .y((p) => p.layout.y)
        .addAll(pages);
      const page = tree.find(x, y);
      if (!page) return;
      if (
        x > page.layout.x &&
        x + width < page.layout.x + page.layout.width &&
        y > page.layout.y &&
        y + height < page.layout.y + page.layout.height
      ) {
        console.log("move to page", page);
        node.pageId = page.id;
        node.relative = "pageId";
        let canvasChildren = canvas.children ?? [];
        canvasChildren = canvasChildren.filter((n) => n.id !== node.id);
        canvas.children = canvasChildren;
        node.layout = {
          ...node.layout,
          x: x - page.layout.x,
          y: y - page.layout.y,
        };
        page.children.push(node);
      }
      // console.log(tree.find(x, y));
    },
  };
  moveEndMode[node.relative as keyof typeof moveEndMode]();
};
const moving = (event: MouseEvent) => {};
const canvasDragover = (event: DragEvent) => {
  event.preventDefault();
  event.stopPropagation();
};
const drop = (
  event: DragEvent,
  value?: {
    containerId: string;
    container: HTMLElement;
  }
) => {
  if (!event || !event.dataTransfer) return;

  event.preventDefault();
  event.stopPropagation();
  const dt = event.dataTransfer;
  const node = serializer.deserialize<ZDragNode>(dt.getData("json"));
  const newValue = value ?? {
    containerId: selectCanvas.value.id,
    container: editorCanvasRef.value?.infiniteCanvas as HTMLElement,
  };

  const data = { ...newValue, node };
  addNode(event, data);
};
const setSelectNode = (node?: ZDragNode) => {
  selectNode.value = node;
};
const arrow = () => {
  selectCanvas.value.mode = "select";
};
const drag = () => {
  selectCanvas.value.mode = "drag";
};
onMounted(() => {});
onUnmounted(() => {
  treeMap.clear();
});
// const store = defineModel<ZDragEditorModel>({
//   required: true,
//   default: () => ({
//     nodes: [],
//     canvas: {
//       width: window.innerWidth,
//       height: window.innerHeight,
//       scale: 0.8,
//       drag: false,
//       scroll: {
//         left: 0,
//         top: 0,
//       },
//     },
//     active: undefined,
//     moving: false,
//     components: [],
//   }),
// });
// // const props = withDefaults(
// //   defineProps<{
// //     option: Partial<ZOption>;
// //   }>(),
// //   {
// //     option: () => ({}),
// //   }
// // );
// // const withOption = computed(() =>
// //   Object.assign(
// //     {
// //       lines: {
// //         color: "primary",
// //         diff: 3,
// //         interval: 8,
// //       },
// //       canvasContextMenu: {
// //         items: [
// //           {
// //             label: "重命名",
// //             action: (node: ZDragNode) => console.log("重命名", node),
// //             icon: "",
// //           },
// //           {
// //             label: "复制",
// //             action: (node: ZDragNode) => console.log("复制", node),
// //           },
// //           {
// //             label: "删除",
// //             action: (node: ZDragNode) => console.log("删除", node),
// //             icon: "",
// //             disabled: false,
// //           },
// //         ],
// //         clickClose: true,
// //       },
// //     },
// //     props.option
// //   )
// // );
// const canvasRef = ref<InstanceType<typeof ZDragEditorCanvas> | null>(null);
// const nodeMap = reactive<ZNodeMap>(new Map());
// const prefixId = computed(() => Array.from(nodeMap.keys()).join("-"));
// const initNodeMap = (val: ZDragNodes, nodeMap: ZNodeMap) => {
//   const recursive = (node: ZDragNode, nodeMap: ZNodeMap) => {
//     nodeMap.set(node.id, node);
//     if (node.children?.length) {
//       node.children.forEach((child) => recursive(child, nodeMap));
//     }
//   };
//   val.forEach((node) => recursive(node, nodeMap));
// };
// watch(
//   () => selectCanvas.value,
//   () => {
//     nodeMap.clear();
//     if (!selectCanvas.value) return;
//     initNodeMap(selectCanvas.value.nodes, nodeMap);
//   }
// );
// watch(
//   () => store.value.nodes,
//   (val) => {
//     const recursive = (node: ZDragNode) => {
//       nodeMap.set(node.id, node);
//       if (node.children?.length) {
//         node.children.forEach((child) => recursive(child));
//       }
//     };
//     val.forEach((node) => recursive(node));
//     // const length = val.length;
//     // let maxW = Math.max(...val.map((i) => i.layout.width));
//     // let maxH = Math.max(...val.map((i) => i.layout.height));
//     // store.value.canvas.width = maxW * 10;
//     // store.value.canvas.height = maxH * Math.round(length / 10);
//     // let initStart = 50;
//     // let startX = initStart;
//     // let y = 50;
//     // val.forEach((node, i) => {
//     //   if (i % 10 === 0) {
//     //     startX = initStart;
//     //     y += maxH + 50;
//     //   }
//     //   node.layout.x = startX + 50;
//     //   node.layout.y = y;
//     //   startX += node.layout.width + 50;
//     // });
//   },
//   {
//     immediate: true,
//     once: true,
//   }
// );
// const change = (node?: ZDragNode) => {
//   store.value.active = node;
// };
// onMounted(() => {});
// onUnmounted(() => {
//   nodeMap.clear();
// });
// const addPage = () => {};
// const addNode = () => {};
// const drop = (event: DragEvent) => {
//   event.preventDefault();
//   event.stopPropagation();
//   let dt = event.dataTransfer;
//   const str = dt?.getData("component");
//   if (!str) return false;
//   let com = JSON.parse(str) as ZDragNode;
//   com.id = prefixId.value + "-" + Math.round(Math.random() * 100 + 1);
//   const dom = event.target as HTMLElement;
//   const { type, id } = dom.dataset;
//   if (canvasRef.value && canvasRef.value.infiniteCanvas) {
//     const canvas = canvasRef.value.infiniteCanvas;
//     const { x, y } = calculateMousedownPosition(
//       event,
//       canvas,
//       store.value.canvas.scale
//     );
//     if (type === "page" && id) {
//       const parent = nodeMap.get(id);
//       if (parent) {
//         com.parentId = parent.id;
//         com.relativeCanvas = parent.id;
//         parent.children = parent.children || [];
//         com.layout.x = Math.round(x) - parent.layout.x - com.layout.width / 2;
//         com.layout.y = Math.round(y) - parent.layout.y - com.layout.height / 2;
//         parent.children.push(com);
//         return;
//       }
//     }
//     com.relativeCanvas = "canvas";
//     com.layout.x = Math.round(x) - com.layout.width / 2;
//     com.layout.y = Math.round(y) - com.layout.height / 2;
//     store.value.nodes.push(com);
//   }
// };
// const dragenter = (event: DragEvent) => {
//   event.preventDefault();
// };
// const dragover = (event: DragEvent) => {
//   event.preventDefault();
// };
// const itemDragstart = (event: DragEvent, com: ZDragNode) => {
//   let dt = event.dataTransfer;
//   dt?.setData("component", JSON.stringify(com));
// };
// const itemDragend = (event: DragEvent) => {
//   event.preventDefault();
// };
// const moveStart = () => {
//   store.value.moving = true;
// };
// const moveEnd = () => {
//   store.value.moving = false;
//   if (!store.value.active) return;
//   const node = store.value.active;
//   if (node.type === "page") return;
//   const { x, y, width, height } = store.value.active.layout;
//   if (!node.parentId) {
//     const nodes = store.value.nodes.filter(
//       (i) => i.id !== node.id && i.type === "page"
//     );
//     nodes.forEach((n) => {
//       const page = nodeMap.get(n.id);
//       if (!page) return;
//       const pageLo = page.layout;
//       if (
//         pageLo.x < x &&
//         pageLo.y < y &&
//         pageLo.x + pageLo.width > x + width &&
//         pageLo.y + pageLo.height > y + height
//       ) {
//         const children = page.children || [];
//         node.parentId = page.id;
//         node.relativeCanvas = page.id;
//         page.children = [...children, node];
//         const filterNode = store.value.nodes.filter((c) => {
//           return c.id !== node.id;
//         });
//         store.value.nodes = filterNode;
//         node.layout.x = x - pageLo.x;
//         node.layout.y = y - pageLo.y;
//         change(node);
//         nextTick(() => {});
//         return true;
//       } else return false;
//     });
//   } else {
//     const parent = nodeMap.get(node.parentId);
//     if (parent && parent.type === "page") {
//       const parentLo = parent.layout;
//       if (
//         (x < 0 && Math.abs(x) >= width) ||
//         (y < 0 && Math.abs(y) >= height) ||
//         x > parentLo.width ||
//         y > parentLo.height
//       ) {
//         let children = parent.children || [];
//         parent.children = children.filter((i) => i.id !== node.id);
//         node.parentId = undefined;
//         node.relativeCanvas = "canvas";
//         store.value.nodes.push(node);
//         node.layout.x = parentLo.x + node.layout.x;
//         node.layout.y = parentLo.y + node.layout.y;
//         change(node);
//         nextTick(() => {});
//       }
//     }
//   }
// };
// const dblclick = (parent: ZDragNode, event: MouseEvent) => {
//   if (!parent.children) return;
//   console.dir(parent);
//   let x = event.layerX;
//   let y = event.layerY;
//   if (parent.relativeCanvas !== "canvas") {
//     const canvas = nodeMap.get(parent.relativeCanvas);
//     if (!canvas) return;
//     x = x - canvas.layout.x;
//     y = y - canvas.layout.y;
//   } else if (parent.relativeCanvas === "canvas" && parent.type === "page") {
//     x = x - parent.layout.x;
//     y = y - parent.layout.y;
//   }
//   let start = 0;
//   let end = parent.children.length - 1;
//   let ns: ZDragNode[] = [];
//   while (start < end && end > start) {
//     let bs = [parent.children[start++], parent.children[end--]];
//     bs.forEach((cur) => {
//       if (
//         cur.layout.x <= x &&
//         cur.layout.x + cur.layout.width >= x &&
//         cur.layout.y <= y &&
//         cur.layout.y + cur.layout.height >= y
//       ) {
//         ns.push(cur);
//       }
//     });
//   }
//   if (ns.length) {
//     let index = 0;
//     ns.forEach((n, i) => {
//       if (!ns[i - 1]) return;
//       if (n.layout.zIndex > ns[i - 1].layout.zIndex) index = i;
//     });
//     change(ns[index]);
//   }
// };
// const layout = computed({
//   get() {
//     if (store.value.active?.relativeCanvas === "canvas")
//       return store.value.active?.layout;
//     else {
//       if (!nodeMap.has(store.value.active?.relativeCanvas as string))
//         return {} as ZLayout;
//       const canvas = nodeMap.get(store.value.active?.relativeCanvas as string);
//       if (!store.value.active) return {} as ZLayout;
//       const nodeLayout = store.value.active.layout;
//       if (!canvas) return {} as ZLayout;
//       return {
//         ...nodeLayout,
//         x: canvas.layout.x + nodeLayout.x,
//         y: canvas.layout.y + nodeLayout.y,
//       };
//     }
//   },
//   set(val) {
//     if (!store.value.active) return;
//     if (store.value.active.relativeCanvas === "canvas") {
//       console.log("update  layout > canvas", store.value.active.layout);
//       store.value.active.layout = val;
//     } else {
//       const canvas = nodeMap.get(store.value.active?.relativeCanvas as string);
//       if (!canvas) return;
//       console.log("update  layout > page", store.value.active.layout);
//       store.value.active.layout = {
//         ...val,
//         x: val.x - canvas.layout.x,
//         y: val.y - canvas.layout.y,
//       };
//     }
//     console.log("update layout", store.value.active.layout);
//   },
// });
// const contextMenuItemHandle = (
//   node: ZCanvasContextMenuItem,
//   closeMenu: () => void
// ) => {
//   node.action(store.value.active, closeMenu);
// };
// const canvasModel = ref({
//   width: 1000,
//   height: 1000,
//   scale: 1,
//   x: 0,
//   y: 0,
// });
</script>
<template>
  <article tabindex="0" class="ZDragEditor">
    <template v-if="!$slots.toolbar">
      <ZToolbar class="toolbar">
        <template #left="scope">
          <slot v-if="$slots['toolbar-left']" name="left" v-bind="scope"></slot>
          <template v-else>
            <h1 class="z-logo">ZDragEditor</h1>
          </template>
        </template>
        <template #center="scope">
          <slot v-if="$slots['toolbar-center']" name="center" v-bind="scope"></slot>
          <template v-else>
            <div class="z-toolbar-center-btns">
              <ZBtn
                @click="arrow"
                :color="selectCanvas.mode === 'select' ? 'text-primary' : 'text-default'"
                :padding="false"
              >
                <ZSvgIcon size="md" name="cursor"></ZSvgIcon>
              </ZBtn>
              <ZBtn
                @click="drag"
                :color="selectCanvas.mode === 'drag' ? 'text-primary' : 'text-default'"
                :padding="false"
              >
                <ZSvgIcon size="sm" name="grab"></ZSvgIcon>
              </ZBtn>
            </div>
          </template>
        </template>
        <template #right="scope">
          <slot v-if="$slots['toolbar-right']" name="right" v-bind="scope"></slot>
          <template v-else>
            <ZScaleController v-model="selectCanvas.layout.scale"></ZScaleController>
          </template>
        </template>
      </ZToolbar>
    </template>
    <slot name="toolbar"></slot>
    <div v-if="!$slots.default" class="z-editor-content">
      <ul class="z-editor-menu">
        <li
          v-for="item in withMenus"
          :key="item.name"
          class="z-editor-menu-item"
          :class="{
            active: selectMenu.name === item.name,
          }"
          @click="setSelectMenu(item)"
        >
          <ZSvgIcon :size="24" class="icon" :name="item.icon"></ZSvgIcon>
          <span class="text">{{ item.text }}</span>
        </li>
      </ul>
      <ZSplitter class="z-splitter">
        <template #left>
          <div v-if="!$slots.left" class="z-left-content">
            <KeepAlive :max="5">
              <component
                v-model:canvas="canvas"
                v-model:treeMap="treeMap"
                v-model:selectCanvas="selectCanvas"
                v-model:selectNode="selectNode"
                :components="components"
                :is="selectMenu.component"
              ></component>
            </KeepAlive>
          </div>
          <slot name="left"></slot>
        </template>
        <template #center>
          <div v-if="!$slots.center" class="z-main-content">
            <!-- <ContextMenu
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
          </ContextMenu> -->
            <ZDragEditorCanvas
              v-if="selectCanvas"
              v-model="selectCanvas.layout"
              :nodes="selectCanvas.children"
              v-model:mode="selectCanvas.mode"
              ref="editorCanvasRef"
              @dragover="canvasDragover"
              @drop="drop"
              @mousedown.stop="setSelectNode()"
            >
              <template #default="{ canvas }">
                <div style="position: absolute; top: 0; left: 0">
                  <ZDrag
                    v-if="selectNode"
                    v-model="hijackNodeAxis"
                    position="absolute"
                    @before-move="beforeMove"
                    @after-move="afterMove"
                    @moving="moving"
                    :container="(canvas as HTMLElement)"
                    :scale="selectCanvas.layout.scale"
                    :active="Boolean(selectNode)"
                    :rotate="selectNode.rotate"
                  >
                  </ZDrag>
                </div>
                <ZNode
                  v-for="(node, index) in selectCanvas.children"
                  :key="node.id"
                  v-model="selectCanvas.children[index]"
                  @select="setSelectNode"
                  @mousedown.stop="setSelectNode(selectCanvas.children[index])"
                  @drop="drop"
                ></ZNode>
              </template>
            </ZDragEditorCanvas>
          </div>
          <slot name="center"></slot>
        </template>
        <template #right>
          <div v-if="!$slots.right" class="z-right-content">
            <div v-if="selectNode">
              <div class="row">
                <ZTextField
                  class="col"
                  :model-value="selectNode.layout.x"
                  label="X"
                  placeholder="x轴坐标"
                  required
                />
                <ZTextField
                  class="col"
                  :model-value="selectNode.layout.y"
                  label="Y"
                  placeholder="Y轴坐标"
                  required
                />
                <ZTextField
                  class="col"
                  :model-value="selectNode.layout.rotate"
                  label="°"
                  placeholder="Y轴坐标"
                  required
                />
              </div>
              <div class="row">
                <ZTextField
                  class="col"
                  :model-value="selectNode.layout.width"
                  label="宽"
                  placeholder="x轴坐标"
                  required
                />
                <ZTextField
                  class="col"
                  :model-value="selectNode.layout.height"
                  label="高"
                  placeholder="Y轴坐标"
                  required
                />
              </div>
            </div>
          </div>
          <slot name="right"></slot>
        </template>
      </ZSplitter>
    </div>

    <slot name="default"></slot>
  </article>
</template>
<style scoped lang="scss">
.ZDragEditor {
  overflow: hidden;
  box-sizing: border-box;
  .z-editor-content {
    height: calc(100% - 50px);
    display: flex;
    .z-editor-menu {
      width: 50px;
      height: 100%;
      max-height: 100%;
      list-style: none;
      padding: 0;
      padding-top: 8px;
      padding-right: 4px;
      margin: 0;
      border-right: 1px solid rgba(var(--z-quiet));
      box-sizing: border-box;

      .z-editor-menu-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        color: var(--z-text);
        margin-bottom: 8px;
        padding: 4px 0;
        position: relative;
        .icon {
          z-index: 1;
        }
        .text {
          font-size: var(--z-font-sm);
          z-index: 1;
        }
        cursor: pointer;
        &::before {
          content: "";
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          border-radius: 0 8px 8px 0;
          transition: transform 0.2s ease-in-out;
          box-shadow: 0px 0px 6px rgba(64, 87, 109, 0.6);
          // box-shadow: 0px 6px 20px -4px rgba(64, 87, 109, 0.3),
          //   0px 0px 0px 1px rgba(64, 87, 109, 0.04);
          // 0px 0px 0px 1px rgba(64, 87, 109, 0.04),
          // rgba(64, 87, 109, 0.3)
          // transition: width 0.2s ease-in-out, height 0.2s ease-in-out;
          transform: scaleX(0);
          transform-origin: left;
        }
        // &:hover {
        // 	&::before {
        // 		transform: scaleX(1);
        // 		background-color: rgba(var(--z-quiet), 0.3);
        // 	}
        // }
        &.active {
          &::before {
            transform: scaleX(1);
            background-color: rgba(var(--z-primary), 1);
          }
          color: rgb(var(--z-text-light));
        }
      }
    }
    .z-splitter {
      width: calc(100% - 50px);
    }
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
    // padding: 8px 16px;
    height: 100%;
    width: 100%;
  }
  .z-main-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .z-right-content {
    // padding: 8px 16px;
    height: 100%;
    width: 100%;
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
