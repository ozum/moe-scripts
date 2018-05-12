/**
 * @module build
 * @desc
 * Build project using TypeScript, Babel or rollup based on project type.
 *
 * **TypeScript**
 * * Copies js and d.ts files from src to lib using `rsync`, because `tsc` does not allow `--allowJs` and `--declaration` parameters at the same time.
 * * Cleans target directory before build.
 *
 * **Babel**
 * * If no `--ignore` parameter presents, ignores by default: `__tests__`, `__mocks__`, `__test_supplements__`, `__test_helpers__`, `*.(test|spec).(js|ts|jsx|tsx)`
 *
 * @property          [--bundle]      If present, uses rollup, otherwise TypeScript or Babel.
 * @property {string} [--outDir=lib]  ![TS](https://img.shields.io/badge/-TS-2C4E7E.svg) Output destination for built files.
 * @property          [--no-clean]    ![TS](https://img.shields.io/badge/-TS-2C4E7E.svg) If present, does not clean target directory.
 * @property {string} [--out-dir=lib] ![Babel](https://img.shields.io/badge/-Babel-F3DA62.svg) Output destination for built files.
 * @property [OTHERS]                 All CLI options used by related binary. (tsc, babel or rollup)
 * @example
 * $ npm run build -- --watch --preserveWatchOutput
 * $ npx moe-scripts build
 * $ npx moe-scripts build --watch --preserveWatchOutput
 */
import { Project, Script, ScriptKit } from "script-helper";

const script: Script = function script(project: Project, args: Array<any>, s: ScriptKit) {
  const subScript = args.includes("--bundle") ? "rollup" : project.isTypeScript ? "tsc" : "babel";
  return s.executeSubScriptSync(subScript, args);
};

export { script };
