/**
 * @module reset
 * @desc
 * Reverses modifications made by this library. (Please note that deleted files are not reversed. You should recover them from git repo)
 *
 * @example
 * $ npx moe-scripts reset
 */
import { Project, Script, ScriptKit } from "script-helper";

const script: Script = function script(project: Project, args: Array<any>, s: ScriptKit) {
  // If it called itself, skip.
  if (project.name === project.moduleName) {
    project.logger.warn(`reset script is skipped, because project and module are same: "${project.name}".`);
    return { status: 0 };
  }
  project.resetSync();
  return { status: 0 };
};

export { script };
