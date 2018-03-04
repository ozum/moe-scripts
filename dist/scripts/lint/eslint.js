var path = require("path");

var spawn = require("cross-spawn");

var yargsParser = require("yargs-parser");

var _require = require("../../utils"),
    hasPkgProp = _require.hasPkgProp,
    resolveBin = _require.resolveBin,
    hasFile = _require.hasFile;

var args = process.argv.slice(2);

var here = function (p) {
  return path.join(__dirname, p);
};

var hereRelative = function (p) {
  return here(p).replace(process.cwd(), ".");
};

var parsedArgs = yargsParser(args);
var useBuiltinConfig = !args.includes("--config") && !hasFile(".eslintrc") && !hasFile(".eslintrc.js") && !hasPkgProp("eslintConfig");
var config = useBuiltinConfig ? ["--config", hereRelative("../../config/eslintrc.js")] : [];
var useBuiltinIgnore = !args.includes("--ignore-path") && !hasFile(".eslintignore") && !hasPkgProp("eslintIgnore");
var ignore = useBuiltinIgnore ? ["--ignore-path", '.gitignore'] //  ? ["--ignore-path", hereRelative("../../config/eslintignore")]
: [];
var cache = args.includes("--no-cache") ? [] : ["--cache"];
var filesGiven = parsedArgs._.length > 0;
var filesToApply = filesGiven ? [] : ["."];

if (filesGiven) {
  // we need to take all the flag-less arguments (the files that should be linted)
  // and filter out the ones that aren't js files. Otherwise json or css files
  // may be passed through
  args = args.filter(function (a) {
    return !parsedArgs._.includes(a) || a.endsWith(".js");
  });
}

var result = spawn.sync(resolveBin("eslint"), config.concat(ignore, cache, args, filesToApply), {
  stdio: "inherit"
});
process.exit(result.status);
//# sourceMappingURL=eslint.js.map