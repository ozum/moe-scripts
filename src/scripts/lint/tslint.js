const path = require("path");
const spawn = require("cross-spawn");
const yargsParser = require("yargs-parser");
const { resolveBin, hasFile } = require("../../utils");

let args = process.argv.slice(2);
const here = p => path.join(__dirname, p);
const hereRelative = p => here(p).replace(process.cwd(), ".");
const parsedArgs = yargsParser(args);

const useBuiltinConfig =
  !args.includes("--config") &&
  !hasFile("tslint.json");

const config = useBuiltinConfig
  ? ["--config", hereRelative("../../../tslint-backend.json")]
  : [];

const filesGiven = parsedArgs._.length > 0;

if (filesGiven) {
  // we need to take all the flag-less arguments (the files that should be linted)
  // and filter out the ones that aren't ts files. Otherwise json or css files
  // may be passed through
  const filesCount = filesGiven;
  args = args.filter(a => !parsedArgs._.includes(a) || a.endsWith(".ts") || a.endsWith(".tsx"));

  // If given files are not 'ts' or 'tsx' and no project is given skip linting.
  if (args.length === 0 && !args.includes("--project")) {
    console.log("Files are given but none of them are lintable.");
    process.exit(0);
  }
}

const useDefaultProject = !filesGiven && !args.includes("--project");

const project =  useDefaultProject ? ["--project", "./tsconfig.json"] : [];

const result = spawn.sync(
  resolveBin("tslint"),
  [...config, ...args, ...project],
  { stdio: "inherit" }
);

process.exit(result.status);
