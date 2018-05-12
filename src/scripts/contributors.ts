/**
 * @module contributors
 * @desc
 * WIP
 *
 * @example
 * $ npx moe-scripts contributors
 */
import { Project, Script, ScriptKit } from "script-helper";

const spawn = require("cross-spawn");

const script: Script = function script(project: Project, args: Array<any>, s: ScriptKit) {
  return project.executeSync(["all-contributors", args]);
};

export { script };
