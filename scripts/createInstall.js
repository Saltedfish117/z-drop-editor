import fs from "fs";
import path from "path";
function main() {
  const dirPath = path.resolve(import.meta.dirname, "../src/components");
  const initDir = fs.readdirSync(dirPath);
  const dirs = initDir.filter((dir) => dir !== "Icons");
  console.log(dirs);
  dirs.forEach((dir) => {
    const filePath = path.resolve(dirPath, dir, "index.ts");
    fs.writeFileSync(
      path.resolve(dirPath, dir, `${dir}.vue.d.ts`),
      `
import { DefineComponent } from 'vue';
export declare const ${dir}: DefineComponent<{}, {}, any>;
    `
    );
    const fileContent = `
import { withInstall } from '@/common/utils';
import ${dir} from "./${dir}.vue";
export * from './type.ts';
export default withInstall(${dir},${dir})
    `;
    fs.writeFileSync(filePath, fileContent);
  });
  //   const exportTemplate = (name) => `export { default as ${name} } from
  // './components/${name}/index.ts';`;
  //   const exportStr = dirs.map((dir) => exportTemplate(dir)).join("\n");
  //   fs.writeFileSync(
  //     path.resolve(import.meta.dirname, "../src/index.ts"),
  //     exportStr
  //   );
}
main();
