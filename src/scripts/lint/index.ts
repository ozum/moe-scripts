import { Project, Script, ScriptKit } from "script-helper";

const script: Script = function script(project: Project, args: Array<any>, s: ScriptKit) {
  const subScript = project.isTypeScript ? "tslint" : "eslint";
  return s.executeSubScriptSync(subScript, args);
};

export { script };
