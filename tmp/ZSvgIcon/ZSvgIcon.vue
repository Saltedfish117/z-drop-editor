<script setup lang="ts">
import { defineOptions, withDefaults, computed, ref, watch } from "vue";
import type { ZSvgIconProps } from "./type.ts";
import { Size, Color } from "@/common/type.ts";
const svgIconUrls = import.meta.glob("@/assets/icon/svg/*.svg", {
  as: "raw",
});
// console.log(svgIconUrls);
const icons = Object.keys(svgIconUrls).reduce<Record<string, any>>((pre, cur) => {
  const key = cur.replace(/^.*[\\/]/, "").replace(/\.\w+$/, "");
  pre[key] = svgIconUrls[cur];
  return pre;
}, {});
defineOptions({
  name: "ZSvgIcon",
});
const props = withDefaults(defineProps<ZSvgIconProps>(), {
  size: "md",
  name: "",
});
const size = computed(() => {
  if (typeof props.size === "string" && props.size in Size) {
    return Size[props.size] + "px";
  } else if (typeof props.size === "number") {
    return props.size + "px";
  }
});
const color = computed(() => {
  if (typeof props.color === "string" && props.color in Color) {
    return Color[props.color as keyof typeof Color];
  } else if (typeof props.color === "string") {
    return props.color;
  }
});
const icon = ref("");
watch(
  () => props.name,
  () => {
    if (icons[props.name]) {
      icons[props.name]()
        .then((response: string) => {
          // const fillReg = /fill\s*=\s*(["']?)([^"']*)\1/gi;
          // const sizeReg = /(width|height)\s*=\s*["']\d+["']/g;
          let svg = response;
          //   .replace(fillReg, `fill="currentColor"`)
          //   .replace(sizeReg, ``)
          //   .replace(/<svg/, '<svg width="100%" height="100%"');
          // icon.value = svg;
          const domParser = new DOMParser();
          let svgDoc = domParser.parseFromString(svg, "image/svg+xml");
          let svgDom = svgDoc.getElementsByTagName("svg")[0];
          const paths = svgDom.getElementsByTagName("path");
          const rect = svgDom.getElementsByTagName("rect");
          for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            path.setAttribute("fill", "currentColor");
          }
          for (let i = 0; i < rect.length; i++) {
            const path = rect[i];
            path.setAttribute("fill", "currentColor");
          }
          svgDom.setAttribute("width", "100%");
          svgDom.setAttribute("height", "100%");
          svgDom.setAttribute("fill", "currentColor");
          const serializer = new XMLSerializer();
          icon.value = serializer.serializeToString(svgDom);
          //   console.log(response);
          //   icon.value = response.default;
        })
        .catch((err: Error) => {
          console.error("图标加载失败:", err);
          icon.value = "";
        });
    } else {
      console.error("icon not found");
    }
  },
  {
    immediate: true,
  }
);
</script>
<template>
  <div
    class="ZSvgIcon"
    :style="{
      width: size,
      height: size,
      color: color,
    }"
    v-html="icon"
  ></div>
</template>
<style scoped lang="scss">
.ZSvgIcon {
  svg {
    path {
      fill: currentColor; // 继承外层颜色
      stroke: currentColor; // 继承描边颜色
    }
  }
}
</style>
