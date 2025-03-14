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
import type { ZNode as Node } from "../ZNode/types";
import type { ZDragEditorModel, ZNodeMap, ZOption } from "./types";
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
const active = ref<Node | null>(null);
const nodeMap = reactive<ZNodeMap>(new Map());
watch(
  () => store.value.active,
  (value) => {
    console.log(value);
    if (!value) return (active.value = null);
    if (value.parentId) {
      active.value = null;
    } else {
      active.value = value;
    }
    console.log(active.value);
  }
);
watch(
  () => store.value.nodes,
  (val) => {
    const recursive = (node: Node) => {
      nodeMap.set(node.id, node);
      if (node.children?.length) {
        node.children.forEach((child) => recursive(child));
      }
    };
    let nodesWidth =
      val.reduce((prev, curr) => (prev += curr.layout.width), 0) +
      50 * val.length;
    let maxHeight = Math.max(...val.map((i) => i.layout.height));
    store.value.canvas.width = Math.round(nodesWidth * 3);
    store.value.canvas.height = Math.round(maxHeight * 3);
    let startX = Math.round(store.value.canvas.width / 2 - nodesWidth / 2);
    let y = Math.round(store.value.canvas.height / 2 - maxHeight / 2);
    val.forEach((node) => {
      node.layout.x = startX + 50;
      startX += node.layout.width + 50;
      node.layout.y = y;
      recursive(node);
    });
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
onUnmounted(() => {
  nodeMap.clear();
});
const selectedNode = ref({ id: 1, name: "node1" });
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
const leftHidden = ref(false);
</script>
<template>
  <article tabindex="0" class="ZDragEditor">
    <template v-if="!$slots.toolbar">
      <ZToolbar class="toolbar" v-model:store="store">
        <template #left="scope">
          <slot v-if="$slots['toolbar-left']" name="left" v-bind="scope"></slot>
          <template v-else>
            <h1 class="logo">ZDragEditor</h1>
            <ZBtn color="default" @click="leftHidden = !leftHidden"
              >{{ leftHidden ? "展示" : "隐藏" }}左侧面板
            </ZBtn>
          </template>
        </template>
        <template #center="scope">
          <slot
            v-if="$slots['toolbar-center']"
            name="center"
            v-bind="scope"
          ></slot>
          <template v-else>
            <div class="toolbar-center-btns">
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
    <ZSplitter v-if="!$slots.default" class="splitter" :leftHidden="leftHidden">
      <template #left>
        <div v-if="!$slots.left" class="left-content"></div>
        <slot name="left" :store="store"></slot>
      </template>
      <template #center>
        <div v-if="!$slots.center" class="main-content">
          <ContextMenu :menuItems="menuItems"></ContextMenu>
          <ZDragEditorCanvas
            @mousewheel="mousewheel"
            :scale="store.canvas.scale"
            v-model:size="store.canvas"
            :hidden-scroll="false"
            @mousedown="change()"
            class="canvas"
            :drag="store.canvas.drag"
          >
            <template #default="{ canvas }">
              <ZDrag
                v-if="active"
                v-model="active.layout"
                position="absolute"
                :parent="(canvas as HTMLElement)"
                :scale="store.canvas.scale"
                :active="Boolean(active)"
                :rotate="active.type !== 'page'"
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
              ></ZLines>
              <ZNode
                v-for="(node, index) in store.nodes"
                :key="node.id"
                v-model:store="store"
                v-model="store.nodes[index]"
                :parent="(canvas as HTMLElement)"
                @mousedown.stop="change(node)"
                :option="withOption"
              ></ZNode>
            </template>
          </ZDragEditorCanvas>
        </div>
        <slot name="center" :store="store"></slot>
      </template>
      <template #right>
        <div v-if="!$slots.right" class="right-content">
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
    <!-- <ZDragEditorCanvas
        @mousewheel="mousewheel"
        :scale="store.canvas.scale"
        v-model:size="store.canvas"
        :hidden-scroll="false"
        @mousedown="change()"
        class="canvas"
        :drag="store.canvas.drag"
      >
        <template #default="{ canvas }">
          <ZDrag
            v-if="active"
            v-model="active.layout"
            position="absolute"
            :parent="(canvas as HTMLElement)"
            :scale="store.canvas.scale"
            :active="Boolean(active)"
            :rotate="active.type !== 'page'"
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
          ></ZLines>
          <ZNode
            v-for="(node, index) in store.nodes"
            :key="node.id"
            v-model:store="store"
            v-model="store.nodes[index]"
            :parent="(canvas as HTMLElement)"
            @mousedown.stop="change(node)"
            :option="withOption"
          ></ZNode>
        </template>
      </ZDragEditorCanvas>
      <ContextMenu :menuItems="menuItems"></ContextMenu> -->
  </article>
</template>
<style scoped lang="scss">
.ZDragEditor {
  overflow: hidden;
  box-sizing: border-box;
  .splitter {
    height: calc(100% - 50px);
  }
  .canvas {
    width: 100%;
    height: 100%;
  }
  .toolbar-center-btns {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  .logo {
    margin: 0;
    font-size: var(--z-font-xl);
    padding: 4px 8px;
    &:hover {
      color: rgba(var(--z-primary), 1);
      cursor: pointer;
    }
  }
  .left-content {
    padding: 8px 16px;
  }
  .main-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .right-content {
    padding: 8px 16px;
  }
}
</style>
