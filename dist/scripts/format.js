var path = require("path");

var spawn = require("cross-spawn");

var yargsParser = require("yargs-parser");

var _require = require("../utils"),
    hasPkgProp = _require.hasPkgProp,
    resolveBin = _require.resolveBin,
    hasFile = _require.hasFile;

var args = process.argv.slice(2);
var parsedArgs = yargsParser(args);

var here = function (p) {
  return path.join(__dirname, p);
};

var hereRelative = function (p) {
  return here(p).replace(process.cwd(), ".");
};

var useBuiltinConfig = !args.includes("--config") && !hasFile(".prettierrc") && !hasFile("prettier.config.js") && !hasPkgProp("prettierrc");
var config = useBuiltinConfig ? ["--config", hereRelative("../config/prettierrc.js")] : [];
var useBuiltinIgnore = !args.includes("--ignore-path") && !hasFile(".prettierignore");
var ignore = useBuiltinIgnore ? ["--ignore-path", hereRelative("../config/prettierignore")] : [];
var write = args.includes("--no-write") ? [] : ["--write"]; // this ensures that when running format as a pre-commit hook and we get
// the full file path, we make that non-absolute so it is treated as a glob,
// This way the prettierignore will be applied

var relativeArgs = args.map(function (a) {
  return a.replace(`${process.cwd()}/`, "");
});
var filesToApply = parsedArgs._.length ? [] : ["**/*.+(js|jsx|json|less|css|ts|tsx|md)"];
var result = spawn.sync(resolveBin("prettier"), config.concat(ignore, write, filesToApply).concat(relativeArgs), {
  stdio: "inherit"
});
process.exit(result.status);
//# sourceMappingURL=format.js.map