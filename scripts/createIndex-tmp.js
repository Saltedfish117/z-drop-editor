import fs from "fs";
import path from "path";
//  "build": "vue-tsc -b && vite build",
function main() {
  const dirs = fs.readdirSync(
    path.resolve(import.meta.dirname, "../src/components")
  );
  const exportTemplate = (name) =>
    `export { default as ${name} } from '@/components/${name}/index.ts';`;
  let exportStr = dirs
    .filter((dir) => dir !== "Icons")
    .map((dir) => exportTemplate(dir));
  const iconPath = path.resolve(
    path.resolve(import.meta.dirname, "../src/components"),
    "./Icons"
  );
  exportStr.push(`
export * from './common/type.ts';
export * from './common/constant.ts';
export * from './common/create.ts';
export * from './common/utils.ts';
          `);

  fs.writeFileSync(
    path.resolve(import.meta.dirname, "../src/index.ts"),
    exportStr.join("\n")
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
