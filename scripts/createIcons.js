import fs from "fs";
import path from "path";
function main() {
  const iconsPath = path.resolve(import.meta.dirname, "../src/assets/icon/svg");
  const icons = fs.readdirSync(iconsPath);
  const names = icons.map((icon) => icon.split(".")[0].replace(/-/g, "_"));

  icons.forEach((icon) => {
    fs.readFile(path.resolve(iconsPath, icon), "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const fillReg = /fill\s*=\s*(["']?)([^"']*)\1/gi;
      const sizeReg = /(width|height)\s*=\s*["']\d+\.?\d{0,2}((px)?|%?)?["']/g;
      const data2 = data
        .replace(fillReg, "")
        .replace(sizeReg, "")
        .replace(
          '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
          ""
        )
        .replace(
          "<svg",
          '<svg width="100%" height="100%" fill="currentColor" v-bind="$attrs"'
        );
      const name = icon.split(".")[0].replace(/-/g, "_");
      const template = `<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
name: "${name}",
})
</script>
<template>
${data2}
</template>
`;
      const iconsDirPath = path.resolve(
        import.meta.dirname,
        `../src/components/Icons`
      );
      const callback = () => {
        fs.mkdir(
          path.resolve(import.meta.dirname, `../src/components/Icons/${name}`),
          () => {
            fs.writeFileSync(
              path.resolve(
                import.meta.dirname,
                "../src/components/Icons/type.ts"
              ),
              `export type Icons = ${names.map((i) => `'${i}'`).join(" | ")}`
            );
            fs.writeFileSync(
              path.resolve(
                import.meta.dirname,
                `../src/components/Icons/${name}/${name}.vue`
              ),
              template
            );
            // 					fs.writeFileSync(
            // 						path.resolve(
            // 							import.meta.dirname,
            // 							`../src/components/Icons/${name}/${name}.vue.d.ts`
            // 						),
            // 						`
            // import { DefineComponent } from 'vue';
            // export declare const ${name}: DefineComponent<{}, {}, any>;
            //         `
            // 					);
          }
        );
      };
      if (fs.existsSync(iconsDirPath)) {
        callback();
      } else {
        fs.mkdir(iconsDirPath, callback);
      }
    });
  });
}
main();
