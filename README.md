# Z-Drop-Editor

<div align="center">

![Vue](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat-square&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-3178C6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

一个基于Vue 3的拖拽编辑器组件库，提供丰富的拖拽编辑功能和组件。

</div>

## 📦 安装

```bash
npm install z-drop-editor
```

## 🚀 主要组件

### ZDragEditor

ZDragEditor是一个功能强大的拖拽编辑器组件，提供了画布、工具栏、菜单等完整的编辑环境。

#### 属性

| 属性名 | 类型 | 默认值 | 说明 |
|:---:|:---:|:---:|:---|
| `components` | `ZDragNodes` | - | 可用的组件列表 |
| `menus` | `ZMenus` | `[{ icon: "design", text: "设计", name: "design", component: "ZDesign" }, { icon: "material", text: "素材", name: "material", component: "ZMaterialList" }]` | 左侧菜单配置 |
| `canvasExtension` | `CanvasExtension` | `{}` | 画布扩展配置 |
| `splitter` | `Object` | `{ leftHidden: false, rightHidden: false, leftMinWidth: 200, rightMinWidth: 200 }` | 分割器配置 |
| `canvases` | `ZCanvasList` | - | 画布列表，必填 |
| `renderNode` | `string` | - | 自定义渲染节点的组件名称 |

#### 插槽

| 插槽名 | 说明 |
|:---:|:---|
| `toolbar` | 自定义工具栏 |
| `toolbar-left` | 自定义工具栏左侧内容 |
| `toolbar-center` | 自定义工具栏中间内容 |
| `toolbar-right` | 自定义工具栏右侧内容 |
| `left` | 自定义左侧面板内容 |
| `center` | 自定义中间画布内容 |
| `right` | 自定义右侧面板内容 |
| `contextMenu` | 自定义右键菜单内容 |
| `default` | 完全自定义内容 |

#### 事件

| 事件名 | 说明 |
|:---:|:---|
| `dragover` | 拖拽悬停事件 |
| `drop` | 拖拽放置事件 |

#### 方法

| 方法名 | 说明 |
|:---:|:---|
| `dblclick` | 双击事件处理 |
| `arrow` | 切换到选择模式 |
| `drag` | 切换到拖拽模式 |
| `setSelectNode` | 设置当前选中的节点 |
| `canvasDragover` | 画布拖拽悬停处理 |
| `addNode` | 添加节点 |
| `getSelectNode` | 获取当前选中的节点 |
| `setSelectCanvas` | 设置当前选中的画布 |
| `getSelectCanvas` | 获取当前选中的画布 |
| `onDragStart` | 注册拖拽开始事件 |
| `onDragMove` | 注册拖拽移动事件 |
| `onDragEnd` | 注册拖拽结束事件 |
| `drop` | 处理拖拽放置 |
| `removeNode` | 移除节点 |

#### 使用示例

```vue
<template>
  <ZDragEditor
    v-model:canvases="canvases"
    :components="components"
    :menus="menus"
    :canvasExtension="canvasExtension"
    :splitter="splitter"
    @dragover="handleDragover"
    @drop="handleDrop"
  >
    <!-- 自定义插槽内容 -->
  </ZDragEditor>
</template>

<script setup>
import { ref } from 'vue';
import { ZDragEditor } from 'z-drop-editor';
import { createCanvas, createNode } from 'z-drop-editor';

// 创建画布
const canvases = ref([createCanvas('1-canvas')]);

// 定义可用组件
const components = ref([
  createNode({
    id: 'component-1',
    label: '组件1',
    type: 'component',
    component: 'ZComponent1',
    relative: 'canvasId',
    canvasId: '1-canvas'
  }),
  // 更多组件...
]);

// 定义菜单
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

// 画布扩展配置
const canvasExtension = ref({
  // 自定义配置
});

// 分割器配置
const splitter = ref({
  leftHidden: false,
  rightHidden: false,
  leftMinWidth: 200,
  rightMinWidth: 200
});

// 事件处理
const handleDragover = (event) => {
  // 处理拖拽悬停
};

const handleDrop = (event) => {
  // 处理拖拽放置
};
</script>
```

### ZDrag

ZDrag是一个拖拽组件，用于实现元素的拖拽功能。

#### 属性

| 属性名 | 类型 | 默认值 | 说明 |
|:---:|:---:|:---:|:---|
| `modelValue` | `ZLayout` | - | 拖拽元素的位置和尺寸信息 |
| `container` | `HTMLElement` | - | 拖拽容器元素 |
| `scale` | `number` | `1` | 缩放比例 |
| `active` | `boolean` | `false` | 是否激活拖拽 |
| `rotate` | `boolean` | `false` | 是否可旋转 |
| `position` | `string` | `'absolute'` | 定位方式 |

#### 事件

| 事件名 | 说明 |
|:---:|:---|
| `before-move` | 拖拽开始前触发 |
| `moving` | 拖拽移动中触发 |
| `after-move` | 拖拽结束后触发 |
| `dblclick` | 双击事件 |

#### 使用示例

```vue
<template>
  <ZDrag
    v-model="layout"
    :container="container"
    :scale="scale"
    :active="active"
    :rotate="hasRotate"
    @before-move="handleBeforeMove"
    @moving="handleMoving"
    @after-move="handleAfterMove"
    @dblclick="handleDblclick"
  >
    <!-- 拖拽内容 -->
  </ZDrag>
</template>

<script setup>
import { ref } from 'vue';
import { ZDrag } from 'z-drop-editor';

const layout = ref({
  x: 0,
  y: 0,
  width: 200,
  height: 200,
  rotate: 0,
  zIndex: 1,
  lock: false
});

const container = ref(document.querySelector('.container'));
const scale = ref(1);
const active = ref(true);
const hasRotate = ref(true);

const handleBeforeMove = (e) => {
  // 拖拽开始前处理
};

const handleMoving = (e) => {
  // 拖拽移动中处理
};

const handleAfterMove = (e) => {
  // 拖拽结束后处理
};

const handleDblclick = (e) => {
  // 双击处理
};
</script>
```

## 🛠️ 工具函数

### 创建函数

#### createCanvas

创建一个画布对象。

```typescript
createCanvas(id: string, value?: Partial<ZCanvas>): ZCanvas
```

**参数：**
- `id`: 画布的唯一标识符
- `value`: 可选的画布配置，会与默认配置合并

**返回值：**
- 返回一个完整的画布对象

**示例：**
```typescript
import { createCanvas } from 'z-drop-editor';

const canvas = createCanvas('1-canvas', {
  layout: {
    width: 1200,
    height: 800,
    scale: 1
  },
  label: '我的画布'
});
```

#### createNode

创建一个节点对象。

```typescript
createNode(value: WithRequiredProperty<CreateNode, "label">): ZDragNode
```

**参数：**
- `value`: 节点配置，必须包含label属性

**返回值：**
- 返回一个完整的节点对象

**示例：**
```typescript
import { createNode } from 'z-drop-editor';

const node = createNode({
  id: 'node-1',
  label: '节点1',
  type: 'component',
  component: 'ZComponent',
  relative: 'canvasId',
  canvasId: '1-canvas',
  layout: {
    x: 100,
    y: 100,
    width: 200,
    height: 150
  }
});
```

#### createGroup

创建一个组节点对象。

```typescript
createGroup(value: WithRequiredProperty<CreateNode, "label" | "children">): ZDragNode
```

**参数：**
- `value`: 组节点配置，必须包含label和children属性

**返回值：**
- 返回一个完整的组节点对象

**示例：**
```typescript
import { createGroup } from 'z-drop-editor';

const group = createGroup({
  id: 'group-1',
  label: '组1',
  type: 'group',
  component: 'ZGroup',
  relative: 'canvasId',
  canvasId: '1-canvas',
  children: [node1, node2, node3]
});
```

### 工具函数

#### calculateMousedownPosition

计算鼠标按下时的位置。

```typescript
calculateMousedownPosition(
  axis: { clientX: number; clientY: number },
  dom: HTMLElement,
  scale: number
): { x: number; y: number }
```

**参数：**
- `axis`: 鼠标事件对象，包含clientX和clientY
- `dom`: 目标DOM元素
- `scale`: 缩放比例

**返回值：**
- 返回计算后的坐标对象

#### calculateGroupLayout

计算组内所有节点的布局。

```typescript
calculateGroupLayout(nodes: ZDragNode[]): { x: number; y: number; width: number; height: number; zIndex: number }
```

**参数：**
- `nodes`: 组内的节点数组

**返回值：**
- 返回计算后的组布局对象

#### whetherToMoveInAndOut

判断节点是否移入或移出容器。

```typescript
whetherToMoveInAndOut(node: ZDragNode, treeMap: ZMap, canvas: ZCanvas): void
```

**参数：**
- `node`: 当前节点
- `treeMap`: 节点树映射
- `canvas`: 当前画布

#### calculateRotateCoordinate

计算旋转后的坐标。

```typescript
calculateRotateCoordinate(
  realTimeCoordinates: { x: number; y: number },
  centerCoordinate: { x: number; y: number },
  _rotate: number
): { x: number; y: number }
```

**参数：**
- `realTimeCoordinates`: 实时坐标
- `centerCoordinate`: 中心坐标
- `_rotate`: 旋转角度

**返回值：**
- 返回旋转后的坐标

#### getCenterCoordinate

获取中心坐标。

```typescript
getCenterCoordinate(
  realTimeCoordinates: { x: number; y: number },
  symmetric: { x: number; y: number }
): { x: number; y: number }
```

**参数：**
- `realTimeCoordinates`: 实时坐标
- `symmetric`: 对称点坐标

**返回值：**
- 返回中心坐标

#### debounce

防抖函数。

```typescript
debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void
```

**参数：**
- `func`: 要执行的函数
- `delay`: 延迟时间（毫秒）

**返回值：**
- 返回防抖后的函数

#### throttle

节流函数。

```typescript
throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void
```

**参数：**
- `func`: 要执行的函数
- `limit`: 限制时间（毫秒）

**返回值：**
- 返回节流后的函数

#### once

只执行一次的函数。

```typescript
once<T extends (...args: any[]) => any>(func: T): (...args: Parameters<T>) => void
```

**参数：**
- `func`: 要执行的函数

**返回值：**
- 返回只执行一次的函数

#### deepMerge

深度合并对象。

```typescript
deepMerge<T extends Record<string, any>>(target: Partial<T>, source: T): T
```

**参数：**
- `target`: 目标对象
- `source`: 源对象

**返回值：**
- 返回合并后的对象

#### deepClone

深度克隆对象。

```typescript
deepClone(obj: any, hash?: WeakMap): any
```

**参数：**
- `obj`: 要克隆的对象
- `hash`: 可选的WeakMap，用于处理循环引用

**返回值：**
- 返回克隆后的对象

## 📝 类型定义

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

## 🎯 完整示例

```vue
<template>
  <div class="editor-container">
    <ZDragEditor
      v-model:canvases="canvases"
      :components="components"
      :menus="menus"
      :canvasExtension="canvasExtension"
      :splitter="splitter"
      @dragover="handleDragover"
      @drop="handleDrop"
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

// 创建画布
const canvases = ref([createCanvas('1-canvas')]);

// 定义可用组件
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

// 定义菜单
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

// 画布扩展配置
const canvasExtension = ref({
  // 自定义配置
});

// 分割器配置
const splitter = ref({
  leftHidden: false,
  rightHidden: false,
  leftMinWidth: 200,
  rightMinWidth: 200
});

// 事件处理
const handleDragover = (event) => {
  // 处理拖拽悬停
};

const handleDrop = (event) => {
  // 处理拖拽放置
};

// 添加新画布
const addNewCanvas = () => {
  const newCanvas = createCanvas(`canvas-${Date.now()}`);
  canvases.value.push(newCanvas);
};

// 导出数据
const exportData = () => {
  const data = JSON.stringify(canvases.value);
  console.log(data);
  // 可以进一步处理，如保存到文件或发送到服务器
};

onMounted(() => {
  console.log('编辑器已加载');
});
</script>

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

## 📄 许可证

[MIT](LICENSE)
