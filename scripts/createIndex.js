import fs from "fs";
import path from "path";
//     "build": "vue-tsc -b && vite build",
function main() {
  const dirs = fs.readdirSync(
    path.resolve(import.meta.dirname, "../src/components")
  );
  const exportTemplate = (name) =>
    `import ${name}  from '@/components/${name}/index.ts';`;
  const filterDirs = dirs.filter((dir) => dir !== "Icons");
  let importStr = filterDirs.map((dir) => exportTemplate(dir));
  let components = `const components = [${filterDirs.join(",")}]`;
  let install = `
const install = (app: App) => {
components.forEach(component => {
    app.use(component)
  })
}
export * from './common/type.ts';
export * from './common/constant.ts';
export * from './common/create.ts';
export * from './common/utils.ts';
export { ${filterDirs.join(",")} }
export default { install }
  `;
  // const iconPath = path.resolve(
  //   path.resolve(import.meta.dirname, "../src/components"),
  //   "./Icons"
  // );
  //   exportStr.push(`
  // export * from './common/type.ts';
  // export * from './common/constant.ts';
  // export * from './common/create.ts';
  // export * from './common/utils.ts';
  //           `);
  fs.writeFileSync(
    path.resolve(import.meta.dirname, "../src/index.ts"),
    `import type {App} from 'vue'\n${
      'import "./var.css";\n ' + importStr.join("\n")
    }\n${components}\n${install}`
  );
  //   fs.readdir(iconPath, (err, data) => {
  //     if (err) return console.log(err);
  //     data
  //       .filter((i) => ![".ts", ".tsx", ".vue"].some((s) => i.includes(s)))
  //       .forEach((dir) => {
  //         exportStr.push(
  //           `export { default as ${dir} } from './components/Icons/${dir}/index.ts';`
  //         );
  //       });
  //     exportStr.push(`
  // export * from './common/type.ts';
  // export * from './common/constant.ts';
  // export * from './common/create.ts';
  // export * from './common/utils.ts';
  //       `);

  //     fs.writeFileSync(
  //       path.resolve(import.meta.dirname, "../src/index.ts"),
  //       exportStr.join("\n")
  //     );
  //   });
}
main();
