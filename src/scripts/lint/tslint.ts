import { Project, Script, ScriptKit } from "script-helper";
import * as path from "path";
import yargsParser from "yargs-parser";

const script: Script = function script(project: Project, rawArgs: Array<any>, s: ScriptKit) {
  let args = rawArgs;
  const parsedArgs = yargsParser(args);
  const useBuiltinConfig = !args.includes("--config") && !project.hasFileSync("tslint.json");
  const config = useBuiltinConfig ? ["--config", s.hereRelative("../../../tslint.json")] : [];
  const filesGiven = parsedArgs._.length > 0;

  if (filesGiven) {
    // we need to take all the flag-less arguments (the files that should be linted)
    // and filter out the ones that aren't ts files. Otherwise json or css files
    // may be passed through
    args = args.filter(a => !parsedArgs._.includes(a) || a.endsWith(".ts") || a.endsWith(".tsx"));

    // If given files are not 'ts' or 'tsx' and no project is given skip linting.
    if (args.length === 0 && !args.includes("--project")) {
      project.logger.info("Files are given but none of them are lintable.");
      return { status: 0 };
    }
  }

  const useDefaultProject = !filesGiven && !args.includes("--project");
  const projectArgs = useDefaultProject ? ["--project", "./tsconfig.json"] : [];
  return project.executeSync(["tslint", [...config, ...args, ...projectArgs]]);
};

export { script };
