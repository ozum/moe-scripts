/**
 * @module lint
 * @desc
 * Lints project using TSLint or ESLint
 *
 * **TSLint**
 * * If project has no `tslint.json` or no `--config` is given, uses builtin configuration provided by this library.
 * * If no files and `--project` argument given, uses default TypeScript project (`tsconfig.json` located in the root of project).
 *
 * **ESLint**
 * * If project has no ESLint configuration (`.eslintrc.js` or `eslintConfig` in `package.json` etc.) or no `--config` is given,
 * uses builtin configuration provided by this library.
 * * If no `--ignore-path` argument is given uses `.gitignore`.
 * * Uses `--cache` by default. (Can be disabled by `--no-cache`).
 *
 * @property [...files]   Files to lint
 * @property [--no-cache] ![ESLint](https://img.shields.io/badge/-ESLint-4941D0.svg) Disables ESLint's `--cache` arg which is added by this script.
 * @property [OTHERS]     All CLI options used by related binary. (TSLint or ESLint)
 * @example
 * $ npm run lint
 * $ npm run lint my-file.ts -- --config my-config.json
 * $ npx moe-scripts lint
 * $ npx moe-scripts lint --no-cache
 * $ npx moe-scripts lint my-file.ts
 */
import { Project, Script, ScriptKit } from "script-helper";

const script: Script = function script(project: Project, args: Array<any>, s: ScriptKit) {
  const subScript = project.isTypeScript ? "tslint" : "eslint";
  return s.executeSubScriptSync(subScript, args);
};

export { script };
