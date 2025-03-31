import fs from "fs";
import path from "path";
function main() {
  const dirs = fs.readdirSync(
    path.resolve(import.meta.dirname, "../src/components")
  );
  const exportTemplate = (name) =>
    `import ${name}  from './components/${name}/index.ts';`;
  const filterDirs = dirs.filter((dir) => dir !== "Icons");
  const input = `{\n${filterDirs
    .map(
      (dir) =>
        `${dir}:path.resolve(__dirname, "src/components/${dir}/index.ts"),`
    )
    .join("\n")}\n}`;
  const exportStr = `{\n${filterDirs
    .map((dir) => `"./${dir}":"./dist/${dir}.js"`)
    .join(",\n")}\n}`;
  fs.writeFileSync(
    path.resolve(import.meta.dirname, "./input.ts"),
    `const i = ${input};\nconst e = ${exportStr}`
  );
}
main();
