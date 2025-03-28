import fs from "fs";
import path from "path";
function main() {
  const dirs = fs.readdirSync(
    path.resolve(import.meta.dirname, "../src/components")
  );
  const exportTemplate = (name) =>
    `export { default as ${name} } from './components/${name}/index.ts';`;
  const exportStr = dirs.map((dir) => exportTemplate(dir)).join("\n");
  fs.writeFileSync(
    path.resolve(import.meta.dirname, "../src/index.ts"),
    exportStr
  );

}
main();
