import { Project, Script, ScriptKit } from "script-helper";
import path from "path";
import yargsParser from "yargs-parser";

const script: Script = function script(project: Project, rawArgs: Array<any>, s: ScriptKit) {
  let args = rawArgs;
  const parsedArgs = yargsParser(args);
  const useBuiltinConfig =
    !args.includes("--config") &&
    !project.hasFileSync(".eslintrc") &&
    !project.hasFileSync(".eslintrc.js") &&
    !project.package.has("eslintConfig");

  const config = useBuiltinConfig ? ["--config", project.fromConfigDir(`eslintrc.${s.extension}`)] : [];

  const useBuiltinIgnore = !args.includes("--ignore-path") && !project.hasFileSync(".eslintignore") && !project.package.has("eslintIgnore");
  const ignore = useBuiltinIgnore ? ["--ignore-path", ".gitignore"] : []; //  ? ["--ignore-path", hereRelative("../../config/eslintignore")]

  const cache = args.includes("--no-cache") ? [] : ["--cache"];
  const filesGiven = parsedArgs._.length > 0;
  const filesToApply = filesGiven ? [] : ["."];

  if (filesGiven) {
    // we need to take all the flag-less arguments (the files that should be linted)
    // and filter out the ones that aren't js files. Otherwise json or css files
    // may be passed through
    args = args.filter(a => !parsedArgs._.includes(a) || a.endsWith(".js") || a.endsWith(".jsx"));

    // If given files are not 'js' or 'jsx' and no project is given skip linting.
    if (args.length === 0) {
      project.logger.info("Files are given but none of them are lintable.");
      return { status: 0 };
    }
  }

  return project.executeSync(["eslint", [...config, ...ignore, ...cache, ...args, ...filesToApply]]);
};

export { script };
