import { Project, Script, ScriptKit } from "script-helper";
import path from "path";

const script: Script = function script(project: Project, args: Array<any>, s: ScriptKit) {
  // Commitizen for multi-repo projects. See: https://github.com/commitizen/cz-cli
  // Moved to helper script, because it uses process.argv and is passed incompatible argument from script-helper
  return project.executeSync(["node", [s.here("../helper-scripts/commitizen.js")]]);
};

export { script };
