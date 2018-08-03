/**
 * @module init
 * @desc
 * Initializes project
 *
 * `init` script generates necessary files and updates `package.json`. This script executed automatically during install at `preinstall` and `postinstall` stages.
 * Also can be manually executed. In addition modification can be reversed using `reset` script.
 *
 * Adds necessary entries in `package.json` and creates files.
 *
 * **Entries in `package.json`**
 *
 * |Entry|Description|
 * |---|---|
 * |main|Primary entry point to your program|
 * |files|Files to publish in npm package|
 * |scripts.file|Watch and execute a file when it changes|
 * |scripts.watch|Watch amd build project when files change|
 * |scripts.build|Build project|
 * |scripts.build:doc|Build README.md from handlebars template and JSDoc comments|
 * |scripts.test|Test project using [Jest](https://facebook.github.io/jest/)|
 * |scripts.test:update|Test project using [Jest](https://facebook.github.io/jest/) and updating snapshots|
 * |scripts.lint|Lint project|
 * |scripts.format|Format project|
 * |scripts.validate|Execute validation scripts|
 * |scripts.commit|Commit project|
 * |scripts.prepublishOnly|Build project before publishing to npm|
 * |scripts.squash|Sqush and merge project branch|
 * |scripts.release|Publish project to git and npm repo|
 *
 * **Files**
 *
 * |File|Track|Link|Description|
 * |---|---|---|---|
 * |.git/hooks| | |**(Only during preinstall)** githooks directory|
 * |.env|✓| |Environment variables to read from using [dotenv](https://www.npmjs.com/package/dotenv) (also included)|
 * |.env.sample|✓| |Sample file for .env|
 * |.npmignore|✓|✓|Npm ignore file provided by this library|
 * |.gitignore|✓|✓|Git ignore file provided by this library|
 * |.gitattributes|✓|✓|Gitattributes file provided by this library|
 * |CHANGELOG.md| | |A base change log file|
 * |.editorconfig|✓| |Editor configruation file|
 * |LICENSE|✓| |License file based on license type in `package.json`|
 * |README.hbs|✓| |Readme template in [handlebars](https://handlebarsjs.com/) format|
 * |.prettierrc.js|✓| |Prettier configuration file|
 * |.prettierignore|✓|✓|Ignore file for prettier|
 * |.huskyrc.js|✓| |[husky](https://github.com/typicode/husky) Configuration file to manage git hooks from npm scripts|
 * |commitlint.config.js|✓| |[commitlint](https://github.com/marionebl/commitlint) Configuration file to lint commit messages|
 * |tslint.json|✓| |![TS](https://img.shields.io/badge/-TS-2C4E7E.svg) TSLint configuration file|
 * |.eslintrc|✓| |![ESLint](https://img.shields.io/badge/-ES-F6DC50.svg) ESLint configuration file|
 * |tsconfig.json|✓| |![TS](https://img.shields.io/badge/-TS-2C4E7E.svg) TypeScript configuration file. (Not created as link, for IDEs|
 * |tsconfig-test.json|✓|✓|![TS](https://img.shields.io/badge/-TS-2C4E7E.svg) TypeScript configuration file used during testing|
 *
 * @property [...files]   Files to lint
 * @property [--no-cache] ![ESLint](https://img.shields.io/badge/-ESLint-4941D0.svg) Disables ESLint `--cache` arg which is added by this script.
 * @property [OTHERS]     All CLI options used by related binary. (TSLint or ESLint)
 * @example
 * $ npx moe-scripts init
 */

import { Project, replaceArgumentName, Executable, Script, ScriptKit } from "script-helper";
import fs from "fs-extra";
import path from "path";
import yargsParser from "yargs-parser";
import handlebars from "handlebars";
const eslint = require("../config/eslintrc"); // const project = require("../project"); olan dosyadan inherit etmek vscode ile eslint2in çalışmasını engelliyor, doğrudan dosyayı yaz.

const getLicense = require("../config/license");

const preInstall: Script = function preInstall(project: Project, rawArgs: Array<any>, s: ScriptKit) {
  project.createDirSync(".git/hooks", { track: false });
  return { status: 0 };
};

const init: Script = function init(project: Project, rawArgs: Array<any>, s: ScriptKit) {
  // If it called itself, skip.
  if (project.name === project.moduleName) {
    project.logger.warn(`init script is skipped, because project and module are same: "${project.name}".`);
    return { status: 0 };
  }

  project.resetSync();
  const forceTestScript = project.package.get("scripts.test") && project.package.get("scripts.test").match("no test specified");
  const scripts = {
    // FASTER Bash Only: "f() { P=$1; P=${P/src/lib}; P=${P/.ts/.js}; tsc-watch --onSuccess \"node -r source-map-support/register ${P}\"; }; f";
    // SLOWER Cross Compatible: "nodemon --watch src --exec ts-node --";
    // For BABEL, consider BABEL-WATCH fro faster scripts
    file: project.isCompiled
      ? project.isTypeScript
        ? 'f() { P=$1; P=${P/src/lib}; P=${P/.ts/.js}; tsc-watch --onSuccess "node -r source-map-support/register ${P}"; }; f' // eslint-disable-line
        : "nodemon --exec babel-node --"
      : "nodemon --",

    // TS Watch için: "concurrently 'npm run build -- --watch' 'npm run test -- --watch' | awk '{gsub(/\\033c/,\"\") system(\"\")}1'" // Prevents tsc --watch clear.
    // After TypeScript 2.8: "concurrently 'npm run build -- --watch --preserveWatchOutput' 'npm run test -- --watch'"
    watch: project.isCompiled
      ? project.isTypeScript
        ? "concurrently 'npm run build -- --watch' 'npm run test -- --watch' | awk '{gsub(/\\033c/,\"\") system(\"\")}1'"
        : "concurrently 'npm run build -- --watch' 'npm run test -- --watch"
      : "npm run test -- --watch",

    squash: "BRANCH=`git rev-parse --abbrev-ref HEAD` && git checkout master && git merge --squash $BRANCH && npm run commit",
    release: "git checkout master && git pull origin master && standard-version && git push --follow-tags origin master && npm publish",
    build: `${project.moduleBin} build${project.isTypeScript ? "" : " --source-maps"}`,
  };

  // License and author details
  const author = project.package.get("author");
  const authorName = typeof author === "string" ? author : author.name;
  const licenseType = project.package.get("license").toLowerCase();
  const licenseText = getLicense(licenseType, authorName);

  project.package
    .set("main", "lib/index")
    .set("files", project.isCompiled ? ["lib", "bin", "@types"] : ["lib"])
    .set("scripts.file", scripts.file)
    .set("scripts.watch", scripts.watch)
    .set("scripts.build:doc", `${project.moduleBin} doc --no-cache`)
    .set("scripts.test", `${project.moduleBin} test`, { force: forceTestScript })
    .set("scripts.test:update", `${project.moduleBin} test --updateSnapshot`)
    .set("scripts.lint", `${project.moduleBin} lint`)
    .set("scripts.format", `${project.moduleBin} format`)
    .set("scripts.validate", `${project.moduleBin} validate`)
    .set("scripts.commit", `${project.moduleBin} commit`)
    .set("scripts.squash", scripts.squash)
    .set("scripts.release", scripts.release);

  if (project.isCompiled) {
    project.package.set("scripts.build", scripts.build).set("scripts.prepublishOnly", "npm run build");
  }

  // It is not necessary to create symlink of module directories using createModuleSymLink("tslint"), because npm installs modules as a flat list,
  // so they are directly in node_modules of project: @types/jest, @types/node, prettier, ts-jest, eslint, tslint

  project.writeFileSync(".env", "");

  project.writeFileSync(".env.sample", "# Description\n# VAR='value'\n");
  project.createSymLinkSync("lib/config/npmignore", ".npmignore");
  project.createSymLinkSync(`lib/config/gitignore/${project.isCompiled ? "compiled" : "non-compiled"}`, ".gitignore");
  project.createSymLinkSync("lib/config/gitattributes", ".gitattributes");
  project.copyFileSync("lib/config/changelog.md", "CHANGELOG.md", { track: false });
  project.copyFileSync("lib/config/editorconfig", ".editorconfig");
  project.writeFileSync("LICENSE", licenseText); // See: https://choosealicense.com/
  project.writeFileSync(
    "README.hbs",
    handlebars.compile(fs.readFileSync(project.fromConfigDir("readme.hbs"), { encoding: "utf8" }))(project.package.data),
  );
  project.writeFileSync(".prettierrc.js", `module.exports = require("${project.moduleName}/prettier");\n`);
  project.createSymLinkSync(`lib/config/prettierignore/${project.isCompiled ? "compiled" : "non-compiled"}`, ".prettierignore");
  project.writeFileSync(".huskyrc.js", `module.exports = require("${project.moduleName}/husky");\n`);
  project.writeFileSync(
    "commitlint.config.js",
    `module.exports = require("${project.moduleName}/commitlint"); // eslint-disable-line import/no-extraneous-dependencies\n`,
  );

  // lint
  if (project.isTypeScript) {
    project.writeFileSync("tslint.json", { extends: `${project.moduleName}/tslint.json` }, { serialize: true, format: "json" });
  } else {
    project.writeFileSync(".eslintrc", eslint, { serialize: true, format: "json" }); // const project = require("../project"); olan dosyadan inherit etmek vscode ile eslint2in çalışmasını engelliyor, doğrudan dosyayı yaz.
    //project.writeFileSync(".eslintrc", { extends: `./node_modules/${project.moduleName}/eslint.js` }, { serialize: true, format: "json" });
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
