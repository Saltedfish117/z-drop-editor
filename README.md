# Z-Drop-Editor

<div align="center">

![Vue](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat-square&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-3178C6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

一个基于 Vue 3 的拖拽编辑器组件库，提供丰富的拖拽编辑功能和组件。

</div>
<img src="./doc/img/Snipaste_2025-04-27_16-30-58.png" />
---

## 目录

- [安装](#安装)
- [快速开始](#快速开始)
- [主要组件](#主要组件)
  - [ZDragEditor](#zdrageditor)
  - [ZDrag](#zdrag)
- [自定义渲染组件](#自定义你的渲染组件(示例))
- [工具函数](#工具函数)
- [类型定义](#类型定义)
- [完整示例](#完整示例)
- [许可证](#许可证)

---

## 📦 安装

```bash
npm install z-drop-editor
```

### 全局注册（必须）

> ⚠️ 本组件库**必须通过全局注册**，不支持按需引入。请在入口文件（如 `main.ts` 或 `main.js`）中使用 `app.use` 安装：

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import ZDropEditor from 'z-drop-editor'

const app = createApp(App)
app.use(ZDropEditor)
app.mount('#app')
```

注册后即可在任意组件中直接使用 `<ZDragEditor />`、`<ZDrag />` 等组件。

---

## ⚡️ 快速开始

最小可运行示例：

```vue
<template>
  <ZDragEditor
    v-model:canvases="canvases"
    :components="components"
  />
</template>

<script setup>
import { ref } from 'vue'
import { createCanvas, createNode } from 'z-drop-editor'

const canvases = ref([createCanvas('main-canvas')])
const components = ref([
  createNode({
    id: 'node-1',
    label: '组件1',
    type: 'component',
    component: 'ZComponent1',
    relative: 'canvasId',
    canvasId: 'main-canvas'
  })
])
</script>
```

---

## 🚀 主要组件

### ZDragEditor

> 拖拽编辑器主组件，提供画布、工具栏、菜单等完整编辑环境。

#### Props

| 属性名            | 类型              | 默认值 | 说明                 |
|-------------------|-------------------|--------|----------------------|
| `components`      | `ZDragNodes`      | -      | 可用的组件列表       |
| `menus`           | `ZMenus`          | 见下   | 左侧菜单配置         |
| `canvasExtension` | `CanvasExtension` | `{}`   | 画布扩展配置         |
| `splitter`        | `Object`          | `{ leftHidden: false, rightHidden: false, leftMinWidth: 200, rightMinWidth: 200 }` | 分割器配置 |
| `canvases`        | `ZCanvasList`     | -      | 画布列表，必填       |
| `renderNode`      | `string`          | -      | 自定义渲染节点的组件名称 |

#### 插槽

| 插槽名           | 说明                   |
|------------------|------------------------|
| `toolbar`        | 自定义工具栏           |
| `toolbar-left`   | 工具栏左侧内容         |
| `toolbar-center` | 工具栏中间内容         |
| `toolbar-right`  | 工具栏右侧内容         |
| `left`           | 左侧面板内容           |
| `center`         | 中间画布内容           |
| `right`          | 右侧面板内容           |
| `contextMenu`    | 右键菜单内容           |
| `default`        | 完全自定义内容         |

#### 事件

| 事件名      | 说明           |
|-------------|----------------|
| `dragover`  | 拖拽悬停事件   |
| `drop`      | 拖拽放置事件   |

#### 方法

| 方法名           | 说明                 |
|------------------|----------------------|
| `dblclick`       | 双击事件处理         |
| `arrow`          | 切换到选择模式       |
| `drag`           | 切换到拖拽模式       |
| `setSelectNode`  | 设置当前选中的节点   |
| `canvasDragover` | 画布拖拽悬停处理     |
| `addNode`        | 添加节点             |
| `getSelectNode`  | 获取当前选中的节点   |
| `setSelectCanvas`| 设置当前选中的画布   |
| `getSelectCanvas`| 获取当前选中的画布   |
| `onDragStart`    | 注册拖拽开始事件     |
| `onDragMove`     | 注册拖拽移动事件     |
| `onDragEnd`      | 注册拖拽结束事件     |
| `drop`           | 处理拖拽放置         |
| `removeNode`     | 移除节点             |

---
### ZDrag

> 拖拽单个元素的基础组件。

#### Props

| 属性名         | 类型         | 默认值     | 说明                     |
|----------------|--------------|------------|--------------------------|
| `modelValue`   | `ZLayout`    | -          | 拖拽元素的位置和尺寸信息 |
| `container`    | `HTMLElement`| -          | 拖拽容器元素             |
| `scale`        | `number`     | `1`        | 缩放比例                 |
| `active`       | `boolean`    | `false`    | 是否激活拖拽             |
| `rotate`       | `boolean`    | `false`    | 是否可旋转               |
| `position`     | `string`     | `'absolute'`| 定位方式                |

#### 事件

| 事件名         | 说明                 |
|----------------|----------------------|
| `before-move`  | 拖拽开始前触发       |
| `moving`       | 拖拽移动中触发       |
| `after-move`   | 拖拽结束后触发       |
| `dblclick`     | 双击事件             |

---
# 自定义你的渲染组件(示例)
```
<script setup lang="ts">
import { computed } from "vue";
import type { ZDragNode } from "z-drop-editor";
import type { CSSProperties } from "vue";
const node = defineModel<ZDragNode>({ required: true });
const style = computed<CSSProperties>(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: `${node.value.layout.width}px`,
  height: `${node.value.layout.height}px`,
  transform: `translate(${node.value.layout.x}px,${node.value.layout.y}px) rotate(${node.value.layout.rotate}deg)`,
}));
</script>
<template>
  <component
    :style="style"
    v-bind="$attrs"
    :is="node.component"
    v-model="node"
    class="custom-node"
  ></component>
</template>
<style scoped>
.custom-node {
  box-sizing: border-box;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
  }
  &:hover {
    &::after {
      border: 2px dashed #409EFF;
    }
  }
}
</style>

<style>
.editor-container {
  width: 100%;
  height: 100vh;
}
.custom-toolbar {
  display: flex;
  gap: 10px;
}
</style>
```
---
## 🛠️ 工具函数

> 提供常用的节点、画布创建与操作工具函数。

### 创建函数

#### createCanvas

> 创建一个画布对象。

```typescript
createCanvas(id: string, value?: Partial<ZCanvas>): ZCanvas
```

- `id`: 画布的唯一标识符
- `value`: 可选的画布配置，会与默认配置合并

**返回值：** 返回一个完整的画布对象

#### createNode

> 创建一个节点对象。

```typescript
createNode(value: WithRequiredProperty<CreateNode, "label">): ZDragNode
```

- `value`: 节点配置，必须包含label属性

**返回值：** 返回一个完整的节点对象

#### createGroup

> 创建一个组节点对象。

```typescript
createGroup(value: WithRequiredProperty<CreateNode, "label" | "children">): ZDragNode
```

- `value`: 组节点配置，必须包含label和children属性

**返回值：** 返回一个完整的组节点对象

### 其它工具函数

- `calculateMousedownPosition(axis, dom, scale)`：计算鼠标按下时的位置。
- `calculateGroupLayout(nodes)`：计算组内所有节点的布局。
- `whetherToMoveInAndOut(node, treeMap, canvas)`：判断节点是否移入或移出容器。
- `calculateRotateCoordinate(realTimeCoordinates, centerCoordinate, _rotate)`：计算旋转后的坐标。
- `getCenterCoordinate(realTimeCoordinates, symmetric)`：获取中心坐标。
- `debounce(func, delay)`：防抖函数。
- `throttle(func, limit)`：节流函数。
- `once(func)`：只执行一次的函数。
- `deepMerge(target, source)`：深度合并对象。
- `deepClone(obj, hash?)`：深度克隆对象。

---

## 📝 类型定义

> 主要类型定义，便于类型推断和二次开发。

### ZLayout

```typescript
interface ZLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  zIndex: number;
  lock: boolean;
}
```

### ZDragNode

```typescript
interface ZDragNode {
  id: string;
  label?: string;
  type: string;
  component: string;
  children?: ZDragNode[];
  parentId?: string;
  hasRotate?: boolean;
  hasLock?: boolean;
  pageId?: string;
  canvasId?: string;
  relative: "pageId" | "canvasId" | "parentId";
  layout: ZLayout;
}
```

### ZCanvas

```typescript
interface ZCanvas {
  layout: {
    x: number;
    y: number;
    width: number;
    height: number;
    scale: number;
    pointerEvents?: CSSProperties["pointerEvents"];
    cursor?: CSSProperties["cursor"];
  };
  mode: string;
  modeLock: boolean;
  children: ZDragNodes;
  id: string;
  readonly type: string;
  label?: string;
}
```

---

## 🎯 完整示例

> 结合所有功能的完整用例，并演示如何自定义渲染节点组件（CustomNode）。

```vue
<template>
  <div class="editor-container">
    <ZDragEditor
      v-model:canvases="canvases"
      :components="components"
      :menus="menus"
      :canvasExtension="canvasExtension"
      :splitter="splitter"
      :renderNode="'CustomNode'"
    >
      <template #toolbar-right>
        <div class="custom-toolbar">
          <button @click="addNewCanvas">添加画布</button>
          <button @click="exportData">导出数据</button>
        </div>
      </template>
    </ZDragEditor>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ZDragEditor } from 'z-drop-editor';
import { createCanvas, createNode, createGroup } from 'z-drop-editor';

const canvases = ref([createCanvas('1-canvas')]);
const components = ref([
  createNode({
    id: 'component-1',
    label: '矩形',
    type: 'component',
    component: 'ZRectangle',
    relative: 'canvasId',
    canvasId: '1-canvas'
  }),
  createNode({
    id: 'component-2',
    label: '圆形',
    type: 'component',
    component: 'ZCircle',
    relative: 'canvasId',
    canvasId: '1-canvas'
  }),
  createGroup({
    id: 'group-1',
    label: '组合',
    type: 'group',
    component: 'ZGroup',
    relative: 'canvasId',
    canvasId: '1-canvas',
    children: []
  })
]);
const menus = ref([
  {
    icon: 'design',
    text: '设计',
    name: 'design',
    component: 'ZDesign'
  },
  {
    icon: 'material',
    text: '素材',
    name: 'material',
    component: 'ZMaterialList'
  }
]);
const canvasExtension = ref({});
const splitter = ref({
  leftHidden: false,
  rightHidden: false,
  leftMinWidth: 200,
  rightMinWidth: 200
});
const addNewCanvas = () => {
  const newCanvas = createCanvas(`canvas-${Date.now()}`);
  canvases.value.push(newCanvas);
};
const exportData = () => {
  const data = JSON.stringify(canvases.value);
  console.log(data);
};
onMounted(() => {
  console.log('编辑器已加载');
});
</script>

<!-- CustomNode.vue -->
<script setup lang="ts">
import { computed } from "vue";
import type { ZDragNode } from "z-drop-editor";
import type { CSSProperties } from "vue";
const node = defineModel<ZDragNode>({ required: true });
const style = computed<CSSProperties>(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: `${node.value.layout.width}px`,
  height: `${node.value.layout.height}px`,
  transform: `translate(${node.value.layout.x}px,${node.value.layout.y}px) rotate(${node.value.layout.rotate}deg)`,
}));
</script>
<template>
  <component
    :style="style"
    v-bind="$attrs"
    :is="node.component"
    v-model="node"
    class="custom-node"
  ></component>
</template>
<style scoped>
.custom-node {
  box-sizing: border-box;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
  }
  &:hover {
    &::after {
      border: 2px dashed #409EFF;
    }
  }
}
</style>

<style>
.editor-container {
  width: 100%;
  height: 100vh;
}
.custom-toolbar {
  display: flex;
  gap: 10px;
}
</style>
```

---

**说明：**
- 通过 `:renderNode="'CustomNode'"` 属性，ZDragEditor 会使用你自定义的 `CustomNode` 组件渲染每个节点。
- CustomNode 的实现方式与 ZNode 完全一致，必须用 `<component :is="node.component" ... />` 动态渲染业务组件。
- 你可以在 `.custom-node` 上自定义样式，或扩展插槽等。

---

## 📄 许可证

[MIT](LICENSE)