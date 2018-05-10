import { Project, Executable, Script } from "script-helper";
import path from "path";
import fs from "fs-extra";
import glob from "glob";
import yargsParser from "yargs-parser";

type TextObject = { [key: string]: string };

function script(project: Project, args: Array<any>): void {
  const crossEnv = project.resolveBin("cross-env");
  const rollup = project.resolveBin("rollup");
  const parsedArgs = yargsParser(args);

  const useBuiltinConfig = !args.includes("--config") && !project.hasFileSync("rollup.config.js");
  const config = useBuiltinConfig ? `--config ${project.fromConfigDir("rollup.config.js")}` : args.includes("--config") ? "" : "--config"; // --config will pick up the rollup.config.js file

  const environment = parsedArgs.environment ? `--environment ${parsedArgs.environment}` : "";
  const watch = parsedArgs.watch ? "--watch" : "";

  let formats = ["esm", "cjs", "umd", "umd.min"];

  if (typeof parsedArgs.bundle === "string") {
    formats = parsedArgs.bundle.split(",");
  }

  const defaultEnv = "BUILD_ROLLUP=true";
  const getCommand = (env: string, ...flags: string[]): string =>
    [crossEnv, defaultEnv, env, rollup, config, environment, watch, ...flags].filter(Boolean).join(" ");

  function getPReactScripts() {
    const reactCommands = prefixKeys("react.", getCommands());
    const preactCommands = prefixKeys("preact.", getCommands({ preact: true }));
    return project.getConcurrentlyArgs(Object.assign(reactCommands, preactCommands));
  }

  function prefixKeys(prefix: string, object: TextObject): TextObject {
    return Object.entries(object).reduce((cmds: TextObject, [key, value]) => {
      cmds[`${prefix}${key}`] = value;
      return cmds;
    }, {});
  }

  function getCommands({ preact = false } = {}): TextObject {
    return formats.reduce((cmds: TextObject, format: string) => {
      const [formatName, minify = false] = format.split(".");
      const nodeEnv = minify ? "production" : "development";
      const sourceMap = formatName === "umd" ? "--sourcemap" : "";
      const buildMinify = Boolean(minify);

      cmds[format] = getCommand(
        [
          `BUILD_FORMAT=${formatName}`,
          `BUILD_MINIFY=${buildMinify}`,
          `NODE_ENV=${nodeEnv}`,
          `BUILD_PREACT=${preact}`,
          `BUILD_NODE=${process.env.BUILD_NODE || false}`,
          `BUILD_REACT_NATIVE=${process.env.BUILD_REACT_NATIVE || false}`,
        ].join(" "),
        sourceMap,
      );
      return cmds;
    }, {});
  }

  const buildPreact = args.includes("--p-react");
  const scripts = buildPreact ? getPReactScripts() : project.getConcurrentlyArgs(getCommands());

  const cleanBuildDirs = !args.includes("--no-clean");

  if (cleanBuildDirs) {
    fs.removeSync(project.fromRoot("dist"));
  }

  if (buildPreact) {
    if (cleanBuildDirs) {
      fs.removeSync(project.fromRoot("preact"));
    }
    fs.mkdirsSync(project.fromRoot("preact"));
  }

  const result = project.executeSync(["concurrently", scripts]);

  if (result.status === 0 && buildPreact && !args.includes("--no-package-json")) {
    const preactPkg = project.fromRoot("preact/package.json");
    const preactDir = project.fromRoot("preact");
    const cjsFile = glob.sync(project.fromRoot("preact/**/*.cjs.js"))[0];
    const esmFile = glob.sync(project.fromRoot("preact/**/*.esm.js"))[0];
    fs.writeFileSync(
      preactPkg,
      JSON.stringify(
        {
          main: path.relative(preactDir, cjsFile),
          "jsnext:main": path.relative(preactDir, esmFile),
          module: path.relative(preactDir, esmFile),
        },
        null,
        2,
      ),
    );
  }
}

export { script };
