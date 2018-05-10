import { Project, replaceArgumentName, Executable, Script, ScriptKit } from "script-helper";
import fs from "fs-extra";
import path from "path";
import yargsParser from "yargs-parser";
import handlebars from "handlebars";

const preInstall: Script = function preInstall(project: Project, rawArgs: Array<any>, s: ScriptKit) {
  project.createDirSync(".git/hooks");
  return { status: 0 };
};

const init: Script = function init(project: Project, rawArgs: Array<any>, s: ScriptKit) {
  // If it called itself, skip.
  if (project.name === project.moduleName) {
    project.logger.warn(`init script is skipped, because project and module are same (${project.name}).`);
    return { status: 0 };
  }

  project.resetSync();
  const gitignoreFile = project.isCompiled ? "compiled" : "non-compiled";
  const forceTestScript = project.package.get("scripts.test") && project.package.get("scripts.test").match("no test specified");
  const scripts = {
    // FASTER Bash Only: "f() { P=$1; P=${P/src/lib}; P=${P/.ts/.js}; tsc-watch --onSuccess \"node -r source-map-support/register ${P}\"; }; f";
    // SLOWER Cross Compatible: "nodemon --watch src --exec ts-node --";
    // For BABEL, consider BABEL-WATCH fro faster scripts
    file: project.isTypeScript
      ? 'f() { P=$1; P=${P/src/lib}; P=${P/.ts/.js}; tsc-watch --onSuccess "node -r source-map-support/register ${P}"; }; f' // eslint-disable-line
      : "nodemon --exec babel-node --",

    // TS Watch için: "concurrently 'npm run build -- --watch' 'npm run test -- --watch' | awk '{gsub(/\\033c/,\"\") system(\"\")}1'" // Prevents tsc --watch clear.
    // After TypeScript 2.8: "concurrently 'npm run build -- --watch --preserveWatchOutput' 'npm run test -- --watch'"
    watch: project.isTypeScript
      ? "concurrently 'npm run build -- --watch' 'npm run test -- --watch' | awk '{gsub(/\\033c/,\"\") system(\"\")}1'"
      : "concurrently 'npm run build -- --watch' 'npm run test -- --watch",
    squash: "BRANCH=`git rev-parse --abbrev-ref HEAD` && git checkout master && git merge --squash $BRANCH && npm run commit",
    release: "git checkout master && git pull origin master && standard-version && git push --follow-tags origin master && npm publish",
    build: `${project.moduleBin} build${project.isTypeScript ? "" : " --source-maps"}`,
  };

  project.package
    .set("main", "lib/index")
    .set("bin", project.isCompiled ? ["lib", "bin", "@types"] : ["lib"])
    .set("scripts.file", scripts.file)
    .set("scripts.watch", scripts.watch)
    .set("scripts.build", scripts.build)
    .set("scripts.build:doc", `${project.moduleBin} doc --no-cache`)
    .set("scripts.test", `${project.moduleBin} test`, { force: forceTestScript })
    .set("scripts.test:update", `${project.moduleBin} test --updateSnapshot`)
    .set("scripts.lint", `${project.moduleBin} lint`)
    .set("scripts.format", `${project.moduleBin} format`)
    .set("scripts.validate", `${project.moduleBin} validate`)
    .set("scripts.commit", `${project.moduleBin} commit`)
    .set("scripts.prepublishOnly", "npm run build")
    .set("scripts.squash", scripts.squash)
    .set("scripts.release", scripts.release);

  // It is not necessary to create symlink of module directories using createModuleSymLink("tslint"), because npm installs modules as a flat list,
  // so they are directly in node_modules of project: @types/jest, @types/node, prettier, ts-jest, eslint, tslint

  project.writeFileSync(".env", "");

  project.writeFileSync(".env.sample", "# Description\n# VAR='value'\n");
  project.createSymLinkSync("lib/config/npmignore", ".npmignore");
  project.createSymLinkSync(`lib/config/gitignore/${gitignoreFile}`, ".gitignore");
  project.createSymLinkSync("lib/config/gitattributes", ".gitattributes");
  project.copyFileSync("lib/config/changelog.md", "CHANGELOG.md", { track: false });
  project.copyFileSync("lib/config/editorconfig", ".editorconfig");
  project.writeFileSync("LICENSE", "", { track: false });
  project.writeFileSync(
    "README.hbs",
    handlebars.compile(fs.readFileSync(project.fromConfigDir("readme.hbs"), { encoding: "utf8" }))(project.package.data),
  );
  project.writeFileSync(".prettierrc.js", `module.exports = require("${project.moduleName}/prettier");\n`);
  project.createSymLinkSync(`lib/config/prettierignore/${project.isCompiled ? "compiled" : "non-compiled"}`, ".prettierignore");
  project.writeFileSync(".huskyrc.js", `module.exports = require("${project.moduleName}/husky");\n`);
  project.writeFileSync("commitlint.config.js", `module.exports = require("${project.moduleName}/commitlint");\n`);

  // lint
  if (project.isTypeScript) {
    project.writeFileSync("tslint.json", { extends: `${project.moduleName}/tslint.json` }, { serialize: true, format: "json" });
  } else {
    project.writeFileSync(".eslintrc", { extends: `./node_modules/${project.moduleName}/eslint.js` }, { serialize: true, format: "json" });
  }

  // compiler
  if (project.isTypeScript) {
    project.copyFileSync("lib/config/tsconfig/backend.json", "tsconfig.json"); // IDEs such as VSCode fails to detect TypeScript errors if file is sym link.
    project.createSymLinkSync("lib/config/tsconfig/backend-test.json", "tsconfig-test.json");
  }

  return { status: 0 };
};

const script: Script = function script(project: Project, args: Array<any>, s: ScriptKit) {
  return process.env.npm_lifecycle_event === "preinstall" ? preInstall(project, args, s) : init(project, args, s);
};

export { script };
