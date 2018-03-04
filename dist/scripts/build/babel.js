var path = require("path");

var spawn = require("cross-spawn");

var rimraf = require("rimraf");

var _require = require("../../utils-moe"),
    normalizeOutDestination = _require.normalizeOutDestination;

var _require2 = require("../../utils"),
    hasPkgProp = _require2.hasPkgProp,
    fromRoot = _require2.fromRoot,
    resolveBin = _require2.resolveBin,
    hasFile = _require2.hasFile;

var args = normalizeOutDestination(process.argv.slice(2), '--out-dir');

var here = function (p) {
  return path.join(__dirname, p);
};

var useBuiltinConfig = !args.includes("--presets") && !hasFile(".babelrc") && !hasPkgProp("babel");
var config = useBuiltinConfig ? ["--presets", here("../../config/babelrc.js")] : [];
var ignore = args.includes("--ignore") ? [] : ["--ignore", "**/__tests__,**/__mocks__,**/__test_supplements__,**/__test_helpers__,**/*.(test|spec).(js|ts|jsx|tsx)"];
var useSpecifiedOutDir = args.includes("--out-dir");
var outDir = useSpecifiedOutDir ? [] : ["--out-dir", "lib"];

if (!useSpecifiedOutDir && !args.includes("--no-clean")) {
  rimraf.sync(fromRoot(outDir[1]));
}

var result = spawn.sync(resolveBin("@babel/cli", {
  executable: "babel"
}), outDir.concat(ignore, config, ["src"]).concat(args), {
  stdio: "inherit"
});
process.exit(result.status);
//# sourceMappingURL=babel.js.map