/**
 * @module validate
 * @desc
 * Validates project.
 *
 * Executes following tasks based on the event being in:
 *
 * |Event|Tasks|
 * |--|--|
 * |precommit|`lint`, `test`, `flow` or `typescript`, `nsp`|
 * |other|`flow` or `typescript`, `nsp`|
 *
 * To avoid redundant execution, `lint` and `test` are not executed in precommit stage because those are executed in `precommit` script
 * already.
 *
 * @property [0] If provided vomma separated list of npm script names to run.
 * @example
 * $ npm run validate my-custom-validator
 * $ npx moe-scripts validate
 * $ npx moe-scripts validate my-custom-validator,second-validator
 */
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
