const path = require("path");
const spawn = require("cross-spawn");
const rimraf = require("rimraf");
const { normalizeOutDestination } = require("../../utils-moe");
const { hasPkgProp, fromRoot, resolveBin, hasFile } = require("../../utils");

const args = normalizeOutDestination(process.argv.slice(2), '--out-dir');
const here = p => path.join(__dirname, p);

const useBuiltinConfig =
  !args.includes("--presets") &&
  !hasFile(".babelrc") &&
  !hasPkgProp("babel");
const config = useBuiltinConfig
  ? ["--presets", here("../../config/babelrc.js")]
  : [];

const ignore = args.includes("--ignore")
  ? []
  : ["--ignore", "**/__tests__,**/__mocks__,**/__test_supplements__,**/__test_helpers__,**/*.(test|spec).(js|ts|jsx|tsx)"];

const useSpecifiedOutDir = args.includes("--out-dir");
const outDir = useSpecifiedOutDir ? [] : ["--out-dir", "lib"];

if (!useSpecifiedOutDir && !args.includes("--no-clean")) {
  rimraf.sync(fromRoot(outDir[1]));
}

const result = spawn.sync(
  resolveBin("@babel/cli", { executable: "babel" }),
  [...outDir, ...ignore, ...config, "src"].concat(args),
  { stdio: "inherit" }
);

process.exit(result.status);
