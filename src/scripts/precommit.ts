/**
 * @module precommit
 * @desc
 * Script to be executed automatically just before commit. Utilizes [lint-staged](https://github.com/okonet/lint-staged)
 *
 * This script is defined in `.huskyrc.js` as required. It is used by `husky` and contains `lint-staged` config.
 *
 * * If no config provided (`--config`, `lint-staged.config.js` or `lint-staged` in `package.json`) uses builtin configuration provided by this library.
 * * Builds README.md and adds it to git
 * * Executes `lint-staged`.
 *     * format (If not opted out) and add to git
 *     * lint
 *     * test (executes test related to changed files)
 * * If opted in, executes validation script.
 *
 * @property [OTHERS]     All CLI options used by related binary. (`prettier`)
 */
import { Project, Script, ScriptKit } from "script-helper";
import path from "path";

const script: Script = function script(project: Project, args: Array<any>, s: ScriptKit) {
  const useBuiltInConfig =
    !args.includes("--config") &&
    !project.hasFileSync(".lintstagedrc") &&
    !project.hasFileSync("lint-staged.config.js") &&
    !project.package.has("lint-staged");

  const config = useBuiltInConfig ? ["--config", project.fromConfigDir(`lintstagedrc.${s.extension}`)] : [];

  return project.executeSync(
    ["echo", ["Building doc and adding it to git..."]],
    ["npm", ["run", "build:doc"]],
    ["git", ["add", "README.md"]],
    ["lint-staged", [...config, ...args]],
    project.isOptedIn("pre-commit") ? ["npm", ["run", "validate"]] : null,
  );
};

export { script };
