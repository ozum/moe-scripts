import { Project, Script, ScriptKit } from "script-helper";
import path from "path";
import yargsParser from "yargs-parser";

const script: Script = function script(project: Project, args: Array<any>, s: ScriptKit) {
  const parsedArgs = yargsParser(args);
  const useBuiltinConfig =
    !args.includes("--config") &&
    !project.hasFileSync(".prettierrc") &&
    !project.hasFileSync("prettier.config.js") &&
    !project.package.has("prettierrc");

  const config = useBuiltinConfig ? ["--config", project.fromConfigDir(`prettierrc.js`)] : [];

  const useBuiltinIgnore = !args.includes("--ignore-path") && !project.hasFileSync(".prettierignore");
  const ignore = useBuiltinIgnore ? ["--ignore-path", project.fromConfigDir("prettierignore")] : [];

  const write = args.includes("--no-write") ? [] : ["--write"];

  // this ensures that when running format as a pre-commit hook and we get
  // the full file path, we make that non-absolute so it is treated as a glob,
  // This way the prettierignore will be applied
  const relativeArgs = args.map(a => a.replace(`${process.cwd()}/`, ""));
  const filesToApply = parsedArgs._.length ? [] : ["**/*.+(js|jsx|json|less|css|ts|tsx|md)"];
  return project.executeSync(["prettier", [...config, ...ignore, ...write, ...filesToApply].concat(relativeArgs)]);
};

export { script };
