var path = require("path");

var spawn = require("cross-spawn");

var _require = require("../utils"),
    isOptedIn = _require.isOptedIn,
    hasPkgProp = _require.hasPkgProp,
    hasFile = _require.hasFile,
    resolveBin = _require.resolveBin;

var here = function (p) {
  return path.join(__dirname, p);
};

var hereRelative = function (p) {
  return here(p).replace(process.cwd(), ".");
};

var args = process.argv.slice(2);
var useBuiltInConfig = !args.includes("--config") && !hasFile(".lintstagedrc") && !hasFile("lint-staged.config.js") && !hasPkgProp("lint-staged");
var config = useBuiltInConfig ? ["--config", hereRelative("../config/lintstagedrc.js")] : [];
var lintStagedResult = spawn.sync(resolveBin("lint-staged"), config.concat(args), {
  stdio: "inherit"
});

if (lintStagedResult.status !== 0 || !isOptedIn("pre-commit")) {
  process.exit(lintStagedResult.status);
} else {
  var validateResult = spawn.sync("npm", ["run", "validate"], {
    stdio: "inherit"
  });
  process.exit(validateResult.status);
}
//# sourceMappingURL=precommit.js.map