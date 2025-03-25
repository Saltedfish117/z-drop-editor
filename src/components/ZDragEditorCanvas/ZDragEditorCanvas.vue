<script setup lang="ts">
import type { CSSProperties, ComponentPublicInstance } from "vue";
import type {
  ZCanvas,
  ZModeHandler,
  ZModeExtension,
  KeyModeExtension,
  ZDragEditorCanvasProps,
} from "./type";
import {
  ref,
  onMounted,
  defineModel,
  computed,
  getCurrentInstance,
  watch,
  defineProps,
  onUnmounted,
  defineExpose,
  defineEmits,
} from "vue";
import * as d3 from "d3";
defineOptions({
  name: "ZDragEditorCanvas",
  directives: {},
});
const props = withDefaults(defineProps<ZDragEditorCanvasProps>(), {
  modeExtension: () => [] as ZModeExtension,
  keydownModeExtension: () => [] as KeyModeExtension,
  keyupModeExtension: () => [] as KeyModeExtension,
});
// 画布容器引用
const instance = getCurrentInstance()?.proxy as ComponentPublicInstance<
  ZDragEditorCanvasProps,
  {},
  {}
>;
const wrapper = ref<HTMLElement | null>(null);
const infiniteCanvas = ref<HTMLElement | null>(null);
defineExpose({ wrapper, infiniteCanvas });
const model = defineModel<ZCanvas>({
  required: true,
});
const mode = defineModel<string>("mode", {
  default: () => "select",
});
const modeLock = defineModel<boolean>("modeLock", {
  default: () => false,
});
const modeHandler: ZModeHandler = {
  select: {
    mounted(_instance, _els, _d3) {
      console.log("select mounted");
    },
    unmounted(_instance, _els, _d3) {
      console.log("select unmounted");
    },
  },
  drag: {
    mounted(instance, els, d3) {
      const wrapperD3 = d3.select(els.wrapper);
      const canvasD3 = d3.select(els.wrapper);
      const zoomChange = (event: {
        transform: {
          x: number;
          y: number;
          k: number;
        };
      }) => {
        instance.$emit("update:modelValue", {
          ...instance.modelValue,
          // scale: event.transform.k,
          x: event.transform.x,
          y: event.transform.y,
        });
      };
      const zoom = d3
        .zoom<HTMLElement, unknown>()
        .scaleExtent([0.1, 3])
        .on("zoom", zoomChange)
        .on("end", () => {
          instance.$emit("update:modelValue", {
            ...instance.modelValue,
            cursor: "grab",
          });
        });
      const initialTransform = d3.zoomIdentity
        .translate(model.value.x, model.value.y) // 初始平移位置
        .scale(model.value.scale); // 初始缩放比例
      zoom.transform(wrapperD3, initialTransform);
      const down = () => {
        instance.$emit("update:modelValue", {
          ...instance.modelValue,
          cursor: "grabbing",
        });
      };
      els.wrapper.addEventListener("mousedown", down);
      wrapperD3.call(zoom);
      wrapperD3.on("dblclick.zoom", null);
      wrapperD3.on("wheel.zoom", null);
      instance.$emit("update:modelValue", {
        ...instance.modelValue,
        pointerEvents: "none",
        cursor: "grab",
      });
      return {
        wrapperD3,
        canvasD3,
        down,
      };
    },
    unmounted(
      instance,
      els,
      _d3,
      value: {
        wrapperD3: d3.Selection<HTMLElement, unknown, null, undefined>;
        canvasD3: d3.Selection<HTMLElement, unknown, null, undefined>;
        down: (e: MouseEvent) => void;
      }
    ) {
      els.wrapper.removeEventListener("mousedown", value.down);
      value.wrapperD3.on(".zoom", null);
      instance.$emit("update:modelValue", {
        ...instance.modelValue,
        pointerEvents: "auto",
        cursor: "default",
      });
      console.log("drag unmounted");
    },
  },
  scale: {
    mounted(instance, els, _d3) {
      const zoomOut = () => {
        if (instance.modelValue.scale - 0.1 < 0.1) return;
        instance.$emit("update:modelValue", {
          ...instance.modelValue,
          scale: Number.parseFloat((instance.modelValue.scale - 0.1).toFixed(1)),
        });
      };
      const zoomIn = () => {
        if (instance.modelValue.scale + 0.1 > 5) return;
        instance.$emit("update:modelValue", {
          ...instance.modelValue,
          scale: Number.parseFloat((instance.modelValue.scale + 0.1).toFixed(1)),
        });
      };
      const mousewheel = (e: WheelEvent) => {
        e.stopPropagation();
        e.preventDefault();
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
      els.wrapper.addEventListener("wheel", mousewheel);
      return {
        mousewheel,
      };
    },
    unmounted(
      _instance,
      els,
      _d3,
      value: {
        mousewheel: (event: WheelEvent) => void;
        // wrapperD3: d3.Selection<HTMLElement, unknown, null, undefined>;
        // canvasD3: d3.Selection<HTMLElement, unknown, null, undefined>;
        // wheelHandler: (event: WheelEvent) => void;
      }
    ) {
      // 移除滚轮事件
      els.wrapper.removeEventListener("wheel", value.mousewheel);
      // value.wrapperD3.on(".zoom", null);
    },
  },
};
const modeExtensionInstall = (extension: ZModeExtension) => {
  extension.forEach((item) => {
    modeHandler[item.name] = item;
  });
};
modeExtensionInstall(props.modeExtension);
const style = computed<CSSProperties>(() => {
  return {
    width: `${model.value.width}px`,
    height: `${model.value.height}px`,
    transform: `translate(${model.value.x}px,${model.value.y}px) scale(${model.value.scale})`,
    pointerEvents: model.value.pointerEvents ?? "auto",
  };
});
const keydownMode: Record<KeyboardEvent["code"], (() => void)[]> = {
  " ": [
    () => {
      if (mode.value === "drag") return;
      mode.value = "drag";
    },
  ],
  Control: [
    () => {
      if (mode.value === "scale") return;
      mode.value = "scale";
    },
  ],
};
const keyupMode: Record<KeyboardEvent["code"], (() => void)[]> = {
  " ": [
    () => {
      mode.value = "select";
    },
  ],
  Control: [
    () => {
      mode.value = "select";
    },
  ],
};
const keydown = (e: KeyboardEvent) => {
  // console.log(e.key);
  if (Array.isArray(keydownMode[e.key])) {
    if (modeLock.value) return;
    keydownMode[e.key].forEach((fn) => fn());
  }
};
const keyup = (e: KeyboardEvent) => {
  if (Array.isArray(keydownMode[e.key])) {
    if (modeLock.value) return;
    keyupMode[e.key].forEach((fn) => fn());
  }
};
let modeMountedReturn: any = null;
watch(
  () => mode.value,
  (newMode: string, oldMode: string) => {
    if (
      !instance ||
      !wrapper.value ||
      !infiniteCanvas.value ||
      !modeHandler[oldMode] ||
      !modeHandler[newMode]
    )
      return;
    modeHandler[oldMode].unmounted(
      instance,
      {
        wrapper: wrapper.value,
        canvas: infiniteCanvas.value,
      },
      d3,
      modeMountedReturn
    );
    modeMountedReturn = modeHandler[newMode].mounted(
      instance,
      {
        wrapper: wrapper.value,
        canvas: infiniteCanvas.value,
      },
      d3
    );
  }
);
const scrollWheel = (event: WheelEvent) => {
  if (mode.value === "scale") return;
  model.value.y -= event.deltaY / 2;
};
onMounted(() => {
  document.addEventListener("keydown", keydown);
  document.addEventListener("keyup", keyup);
  if (wrapper.value) {
    wrapper.value.addEventListener("wheel", scrollWheel);
  }
});
onUnmounted(() => {
  document.removeEventListener("keydown", keydown);
  document.removeEventListener("keyup", keyup);
  if (wrapper.value) {
    wrapper.value.removeEventListener("wheel", scrollWheel);
  }
});
</script>
<template>
  <div
    :style="{
      cursor: model.cursor,
    }"
    ref="wrapper"
    id="z-canvas-wrapper"
    class="canvas-wrapper"
  >
    <article
      :style="style"
      id="z-infinite-canvas"
      class="infinite-canvas"
      ref="infiniteCanvas"
    >
      <slot :wrapper="wrapper" :canvas="infiniteCanvas"></slot>
    </article>
  </div>
</template>
<style scoped lang="scss">
.canvas-wrapper {
  box-sizing: border-box;
  background-color: rgb(244, 245, 247);
  position: relative;
  max-width: 100%;
  width: 100%;
  height: 100%;
  max-height: 100%;
  .infinite-canvas {
    position: relative;
    min-width: 100%;
    min-height: 100%;
    background-color: rgb(var(--canvas-bg-color));
  }
}
</style>
