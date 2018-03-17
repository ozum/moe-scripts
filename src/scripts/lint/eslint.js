const path = require("path");
const spawn = require("cross-spawn");
const yargsParser = require("yargs-parser");
const { hasPkgProp, resolveBin, hasFile } = require("../../utils");

let args = process.argv.slice(2);
const here = p => path.join(__dirname, p);
const hereRelative = p => here(p).replace(process.cwd(), ".");
const parsedArgs = yargsParser(args);

const useBuiltinConfig =
  !args.includes("--config") &&
  !hasFile(".eslintrc") &&
  !hasFile(".eslintrc.js") &&
  !hasPkgProp("eslintConfig");

const config = useBuiltinConfig
  ? ["--config", hereRelative("../../config/eslintrc.js")]
  : [];

const useBuiltinIgnore =
  !args.includes("--ignore-path") &&
  !hasFile(".eslintignore") &&
  !hasPkgProp("eslintIgnore");

const ignore = useBuiltinIgnore
  ? ["--ignore-path", '.gitignore'] //  ? ["--ignore-path", hereRelative("../../config/eslintignore")]
  : [];

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
    console.log("Files are given but none of them are lintable.");
    process.exit(0);
  }
}

const result = spawn.sync(
  resolveBin("eslint"),
  [...config, ...ignore, ...cache, ...args, ...filesToApply],
  { stdio: "inherit" }
);

process.exit(result.status);
