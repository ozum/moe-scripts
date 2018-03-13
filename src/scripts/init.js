require("source-map-support").install();
const path = require("path");
const fs = require("fs");
const yargsParser = require("yargs-parser");
const handlebars = require("handlebars");
const { isTypeScript, createSymLink, createFile, copyFile, writeJson, createModuleSymLink, setPkg } = require("../utils-moe");
const { pkg, pkgPath } = require("../utils");


throw new Error(pkgPath, '----', process.cwd());

if (require(`${process.cwd()}/package.json`).name === "moe-scripts") {
  process.exit(0);
}

process.chdir(pkgPath);

const args = process.argv.slice(2);
const parsedArgs = yargsParser(args, { array: ["target"] });

const isCompiled = (parsedArgs.target || []).includes("compiled") || isTypeScript;

//const here = p => path.join(__dirname, p);
const configFile = p => path.join(__dirname, "../config", p);
const gitignoreFile = isCompiled ? "compile" : "non-compile";

if (pkg && pkg.scripts && pkg.scripts.test === 'echo "Error: no test specified" && exit 1') {
  delete pkg.scripts.test;
}

// FASTER Bash Only: "f() { P=$1; P=${P/src/lib}; P=${P/.ts/.js}; tsc-watch --onSuccess \"node -r source-map-support/register ${P}\"; }; f";
// SLOWER Cross Compatible: "nodemon --watch src --exec ts-node --";
// For BABEL, consider BABEL-WATCH fro faster scripts
const scriptFile = isTypeScript
  ? 'f() { P=$1; P=${P/src/lib}; P=${P/.ts/.js}; tsc-watch --onSuccess "node -r source-map-support/register ${P}"; }; f'
  : "nodemon --exec babel-node --";

// TS Watch için: "concurrently 'npm run build -- --watch' 'npm run test -- --watch' | awk '{gsub(/\\033c/,\"\") system(\"\")}1'" // Prevents tsc --watch clear.
// After TypeScript 2.8: "concurrently 'npm run build -- --watch --preserveWatchOutput' 'npm run test -- --watch'"
const scriptWatch = isTypeScript
  ? "concurrently 'npm run build -- --watch' 'npm run test -- --watch' | awk '{gsub(/\\033c/,\"\") system(\"\")}1'"
  : "concurrently 'npm run build -- --watch' 'npm run test -- --watch";

setPkg({
  "scripts.file": scriptFile,
  "scripts.watch": scriptWatch,
  "scripts.build": `moe-scripts build${isTypeScript ? "" : " --source-maps"}`,
  "scripts.build:doc": `moe-scripts doc --no-cache`,
  "scripts.test": "moe-scripts test",
  "scripts.test:update": "moe-scripts test --updateSnapshot",
  "scripts.lint": "moe-scripts lint",
  "scripts.format": "moe-scripts format",
  "scripts.validate": "moe-scripts validate",
  "scripts.postversion": "git push && git push --tags && npm publish",
  "scripts.prepublishOnly": "npm run build",
});

// It is not necessary to create symlink of module directories using createModuleSymLink("tslint"), because npm installs modules as a flat list,
// so they are directly in node_modules of project: @types/jest, @types/node, prettier, ts-jest, eslint, tslint

createFile(".env", "");
createFile(".env.sample", "# Description\n# VAR='value'\n");
createSymLink(configFile(`gitignore/${gitignoreFile}`), ".gitignore", { force: true });
createSymLink(configFile(`gitattributes`), ".gitattributes", { force: true });
copyFile(configFile("changelog.md"), "CHANGELOG.md");
copyFile(configFile("changelog.md"), "CHANGELOG.md");
copyFile(configFile("editorconfig"), ".editorconfig");
createFile("LICENSE", "");
createFile("README.hbs", handlebars.compile(fs.readFileSync(configFile("readme.hbs"), { encoding: "utf8" }))(pkg));
createFile(".prettierrc.js", 'module.exports = require("moe-scripts/prettier.js");\n');
createFile(".huskyrc.js", 'module.exports = require("moe-scripts/husky.js");\n');

// lint
// Create node_modules/module symlink for IDE support and config file if not exists.
if (isTypeScript) {
  writeJson("tslint.json", { extends: "moe-scripts/tslint-backend.json" });
} else {
  writeJson(".eslintrc", { extends: "./node_modules/moe-scripts/eslint.js" });
}

// compiler
if (isTypeScript) {
  createSymLink(configFile("tsconfig/backend.json"), "tsconfig.json");
  createSymLink(configFile("tsconfig/backend-test.json"), "tsconfig-test.json");
}
