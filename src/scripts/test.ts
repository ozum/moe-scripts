import { Project, Script, ScriptKit } from "script-helper";
import path from "path";
import isCI from "is-ci";

process.env.BABEL_ENV = "test";
process.env.NODE_ENV = "test";

const script: Script = function script(project: Project, args: Array<any>, s: ScriptKit) {
  const watch =
    !isCI &&
    !project.parseEnv("SCRIPTS_PRECOMMIT", false) &&
    !args.includes("--no-watch") &&
    !args.includes("--coverage") &&
    !args.includes("--updateSnapshot") &&
    !args.includes("--watchAll")
      ? ["--watch"]
      : [];

  const config =
    !args.includes("--config") && !project.hasFileSync("jest.config.js") && !project.package.has("jest")
      ? ["--config", JSON.stringify(require("../config/jest.config"))]
      : [];

  require("jest").run([...config, ...watch, ...args]);
  return { status: 0, exit: false };
};

export { script };
