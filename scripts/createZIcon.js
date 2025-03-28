import fs from "fs";
import path from "path";
function main() {
  const iconsPath = path.resolve(import.meta.dirname, "../src/assets/icon/svg");
  const icons = fs.readdirSync(iconsPath);
  const names = icons.map((icon) => icon.split(".")[0].replace(/-/g, "_"));
  let exportStr = "";
  names.forEach((name) => {
    exportStr += `const ${name} = defineAsyncComponent(() => import('@/components/Icons/${name}/${name}.vue'));\n`;
  });
  let scriptStr = `
<script lang="ts">
import { defineAsyncComponent,h,mergeProps,computed } from "vue";
${exportStr}
export default {
  name:'ZIcon',
  components: {
    ${names.map((name) => `${name}: ${name}`).join(",")}
  },
}
</script>
<script setup lang="ts">
import { defineProps } from "vue";
import { Size } from "@/common/type.ts";
import type { ZSvgIconProps } from "./type.ts";
const props = defineProps<ZSvgIconProps>();
const rect = computed(()=>{
  if (typeof props.size === "string" && props.size in Size) {
    return Size[props.size] + "px";
  } else if (typeof props.size === "number") {
    return props.size + "px";
  }
});
</script>\n`;
  const template = `
<template>
<component :is="name" :width="rect" :height="rect" v-bind="$attrs" />
</template>\n
  `;
  const typeStr = `
import type { Size } from "@/common/type";
export interface ZSvgIconProps {
  name: string;
  size?: number | keyof typeof Size;
};`;
  fs.mkdir(path.resolve(import.meta.dirname, "../src/components/ZIcon"), () => {
    fs.writeFileSync(
      path.resolve(import.meta.dirname, "../src/components/ZIcon/ZIcon.vue"),
      scriptStr + template
    );
    fs.writeFileSync(
      path.resolve(import.meta.dirname, "../src/components/ZIcon/type.ts"),
      typeStr
    );
    fs.writeFileSync(
      path.resolve(import.meta.dirname, "../src/components/ZIcon/index.ts"),
      `
import { withInstall } from '@/common/utils'; 
import ZIcon from './ZIcon.vue';
export * from './type.ts';
export default withInstall(ZIcon);`
    );
  });
}
main();
