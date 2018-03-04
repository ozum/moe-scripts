var path = require('path');

var spawn = require("cross-spawn");

var rimraf = require("rimraf");

var _require = require("../../utils-moe"),
    normalizeOutDestination = _require.normalizeOutDestination,
    createSymLink = _require.createSymLink;

var _require2 = require("../../utils"),
    fromRoot = _require2.fromRoot,
    resolveBin = _require2.resolveBin,
    hasFile = _require2.hasFile;

var args = normalizeOutDestination(process.argv.slice(2), "--outDir");

var here = function (p) {
  return path.join(__dirname, p);
};

var useBuiltinConfig = !args.includes("--project") && !hasFile("tsconfig.json"); // Typescript config file must be located at project root. If there isn't any create sym link to this toolkits

if (useBuiltinConfig) {
  createSymLink(here("../../config/tsconfig/backend.json"), "tsconfig.json");
} // const copyFiles = args.includes("--no-copy-files") ? [] : ["--copy-files"];
// .js ve d.ts copy için şunu kullanmayı düşün: "rsync -zarvm --include='*/' --include='*.js' --include='*.d.ts' --exclude='*' 'src/' 'lib'"


var useSpecifiedOutDir = args.includes("--outDir");
var outDir = useSpecifiedOutDir ? [] : ["--outDir", "lib"];

if (!useSpecifiedOutDir && !args.includes("--no-clean")) {
  rimraf.sync(fromRoot(outDir[1]));
}

var result = spawn.sync(resolveBin("typescript", {
  executable: "tsc"
}), outDir.concat().concat(args), {
  stdio: "inherit"
});
process.exit(result.status);
//# sourceMappingURL=tsc.js.map