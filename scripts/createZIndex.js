import fs from "fs";
import path from "path";
function main() {
  const dirs = fs.readdirSync(
    path.resolve(import.meta.dirname, "../src/components")
  );
  const exportTemplate = (name) =>
    `import ${name} from '@/components/${name}/index.ts';`;
  const filterDirs = dirs.filter((dir) => dir !== "Icons");
  let importStr = filterDirs.map((dir) => exportTemplate(dir));
  let components = `const components = [${filterDirs.join(",")}]`;
  // export * from './common/type.ts';
  // export * from './common/constant.ts';
  // export * from './common/create.ts';
  // export * from './common/utils.ts';
  // export { ${filterDirs.join(",")} }
  let install = `
const install = (app: App) => {
components.forEach(component => {
    app.use(component)
  })
}
export default { install }
  `;
  fs.writeFileSync(
    path.resolve(import.meta.dirname, "../src/components/ZDragEditor/index.ts"),
    `import type {App} from 'vue';\n${
      'import "@/var.css";\n ' + importStr.join("\n")
    }\n${components}\n${install}`
  );
}
main();
