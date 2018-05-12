/**
 * @module doc
 * @desc
 * Generates documentation.
 *
 * * Creates or updates `README.md` file from `README.hbs` [handlebars](https://handlebarsjs.com/) template file and
 * [JSDoc](http://usejsdoc.org/) comments in source files.
 * * Generates table of contents.
 * * If no `--configure` parameter is present and no configuration file is available, uses builtin configuration provided by this library.
 * * If no `--files` parameter given, uses all files recursively in `src` directory.
 * * If no `--template` parameter given, uses README.hbs` in project root.
 *
 * @property [OTHERS]     All CLI options used by related binary. (`jsdoc2md`)
 * @example
 * $ npm run build:doc
 * $ npx moe-scripts doc
 */
import { Project, Script, ScriptKit } from "script-helper";
import fs from "fs";
import path from "path";

const script: Script = function script(project: Project, args: Array<any>, s: ScriptKit) {
  const extension = project.isTypeScript ? "ts" : "js";
  const useBuiltinConfig = !args.includes("--configure") && !project.hasFileSync(".jsdoc2md.json") && !project.package.has("jsdoc2md");
  const builtinConfigFile = project.fromConfigDir(`jsdoc2md/${extension}.json`);

  const files = !args.includes("--files") ? ["--files", `src/**/*.${extension}`] : [];
  const config = useBuiltinConfig ? ["--configure", builtinConfigFile] : [];
  const template = !args.includes("--template") || project.hasFileSync("README.hbs") ? ["--template", "README.hbs"] : [];

  const outputFile = fs.openSync("README.md", "w");

  return project.executeSync(
    // TASK: jsdoc2md
    [
      "jsdoc2md",
      [...config, ...template, ...files].concat(args),
      {
        stdio: ["inherit", outputFile, "inherit"],
        encoding: "utf-8",
      },
    ],
    // TASK: doctoc
    ["doctoc", ["README.md"]],
  );
};

export { script };
