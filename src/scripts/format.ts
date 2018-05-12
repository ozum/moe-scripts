/**
 * @module format
 * @desc
 * Formats project using `prettier`.
 *
 * * If no config provided (`--config`, `prettier.config.js` or `prettierrc` in `package.json`) uses builtin configuration provided by this library.
 * * If no `--ignore-path` parameter provided or no `.prettierignore` file is present uses builtin ignore file provided by this library.
 *
 * @property [--no-write] If provided files are not written to disk. (Default is write to disk).
 * @property [OTHERS]     All CLI options used by related binary. (`prettier`)
 * @example
 * $ npm run format
 * $ npx moe-scripts format
 */
import { Project, Script, ScriptKit } from "script-helper";
import path from "path";
import yargsParser from "yargs-parser";

const script: Script = function script(project: Project, args: Array<any>, s: ScriptKit) {
  const parsedArgs = yargsParser(args);
  const useBuiltinConfig =
    !args.includes("--config") &&
    !project.hasFileSync(".prettierrc") &&
    !project.hasFileSync("prettier.config.js") &&
    !project.package.has("prettierrc");

  const config = useBuiltinConfig ? ["--config", project.fromConfigDir(`prettierrc.js`)] : [];

  const useBuiltinIgnore = !args.includes("--ignore-path") && !project.hasFileSync(".prettierignore");
  const ignore = useBuiltinIgnore ? ["--ignore-path", project.fromConfigDir("prettierignore")] : [];

  const write = args.includes("--no-write") ? [] : ["--write"];

  // this ensures that when running format as a pre-commit hook and we get
  // the full file path, we make that non-absolute so it is treated as a glob,
  // This way the prettierignore will be applied
  const relativeArgs = args.map(a => a.replace(`${process.cwd()}/`, ""));
  const filesToApply = parsedArgs._.length ? [] : ["**/*.+(js|jsx|json|less|css|ts|tsx|md)"];
  return project.executeSync(["prettier", [...config, ...ignore, ...write, ...filesToApply].concat(relativeArgs)]);
};

export { script };
