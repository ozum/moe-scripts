import { Project, Script, ScriptKit } from "script-helper";
import util from "util";

const script: Script = function script(project: Project, args: Array<any>, s: ScriptKit) {
  const data = {
    "Project Name": project.name,
    "Project Root": project.root,
    "Module Name": project.moduleName,
    "Module Root": project.moduleRoot,
    "Script Bin": project.resolveScriptsBin(),
  };

  project.logger.info(`Project Details: \n${util.inspect(data, { depth: null })}`);
  return { status: 0 };
};

export { script };
