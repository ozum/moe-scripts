import { Project, replaceArgumentName, Executable, Script, ScriptKit } from "script-helper";

const script: Script = function script(project: Project, args: Array<any>, s: ScriptKit) {
  // precommit runs linting and tests on the relevant files
  // so those scripts don't need to be run if we're running
  // this in the context of a precommit hook.
  const precommit = project.parseEnv("SCRIPTS_PRECOMMIT", false);
  const validateScripts = args[0];
  const useDefaultScripts = typeof validateScripts !== "string";

  const scripts = useDefaultScripts
    ? {
        // build: ifScript("build", "npm run build --silent"),
        lint: precommit ? null : project.package.has("scripts.lint", "npm run lint --silent"),
        test: precommit ? null : project.package.has("scripts.test", "npm run test --silent -- --coverage"),
        flow: project.package.has("scripts.flow", "npm run flow --silent"),
        typescript: project.isTypeScript ? `${project.resolveBin("tsc")} --noemit` : null,
        nsp: precommit ? `${project.resolveBin("nsp")} check` : null,
      }
    : validateScripts.split(",").reduce((scriptsToRun: { [key: string]: string }, name: string) => {
        scriptsToRun[name] = `npm run ${name} --silent`;
        return scriptsToRun;
      }, {});

  return project.executeSync(scripts);
};

export { script };
