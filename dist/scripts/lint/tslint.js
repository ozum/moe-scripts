var path = require("path");

var spawn = require("cross-spawn");

var yargsParser = require("yargs-parser");

var _require = require("../../utils"),
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
var useBuiltinConfig = !args.includes("--config") && !hasFile("tslint.json");
var config = useBuiltinConfig ? ["--config", hereRelative("../../../tslint-backend.json")] : [];
var filesGiven = parsedArgs._.length > 0;

if (filesGiven) {
  // we need to take all the flag-less arguments (the files that should be linted)
  // and filter out the ones that aren't ts files. Otherwise json or css files
  // may be passed through
  args = args.filter(function (a) {
    return !parsedArgs._.includes(a) || a.endsWith(".ts");
  });
}

var useDefaultProject = !filesGiven && !args.includes("--project");
var project = useDefaultProject ? ["--project", "./tsconfig.json"] : [];
var result = spawn.sync(resolveBin("tslint"), config.concat(args, project), {
  stdio: "inherit"
});
process.exit(result.status);
//# sourceMappingURL=tslint.js.map