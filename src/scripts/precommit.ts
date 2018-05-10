import { Project, Script, ScriptKit } from "script-helper";
import path from "path";

const script: Script = function script(project: Project, args: Array<any>, s: ScriptKit) {
  const useBuiltInConfig =
    !args.includes("--config") &&
    !project.hasFileSync(".lintstagedrc") &&
    !project.hasFileSync("lint-staged.config.js") &&
    !project.package.has("lint-staged");

  const config = useBuiltInConfig ? ["--config", project.fromConfigDir(`lintstagedrc.${s.extension}`)] : [];

  return project.executeSync(
    ["echo", ["Building doc and adding it to git..."]],
    ["npm", ["run", "build:doc"]],
    ["git", ["add", "README.md"]],
    ["lint-staged", [...config, ...args]],
    project.isOptedIn("pre-commit") ? ["npm", ["run", "validate"]] : null,
  );
};

export { script };
