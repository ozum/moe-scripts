const path = require('path');
const spawn = require("cross-spawn");
const rimraf = require("rimraf");
const { normalizeOutDestination, createSymLink } = require("../../utils-moe");
const { fromRoot, resolveBin, hasFile } = require("../../utils");

const args = normalizeOutDestination(process.argv.slice(2), "--outDir");
const here = p => path.join(__dirname, p);

const useBuiltinConfig =
  !args.includes("--project") && !hasFile("tsconfig.json");

// Typescript config file must be located at project root. If there isn't any create sym link to this toolkits
if (useBuiltinConfig) {
  createSymLink(here("../../config/tsconfig/backend.json"), "tsconfig.json");
}

// const copyFiles = args.includes("--no-copy-files") ? [] : ["--copy-files"];
// .js ve d.ts copy için şunu kullanmayı düşün: "rsync -zarvm --include='*/' --include='*.js' --include='*.d.ts' --exclude='*' 'src/' 'lib'"

const useSpecifiedOutDir = args.includes("--outDir");
const outDir = useSpecifiedOutDir ? [] : ["--outDir", "lib"];

if (!useSpecifiedOutDir && !args.includes("--no-clean")) {
  rimraf.sync(fromRoot(outDir[1]));
}

const result = spawn.sync(
  resolveBin("typescript", { executable: "tsc" }),
  [...outDir].concat(args),
  { stdio: "inherit" }
);

const rsyncResult = spawn.sync(
  "rsync",
  // dirs begin with __test↴               all dirs↴           all js↴           all .d.ts↴     exclude all else↴
  ["-zarm", "--exclude", "__test*/", "--include", "*/", "--include", "*.js", "--include", "*.d.ts", "--exclude", "*", "src/", "lib"],
  { stdio: "inherit" },
);

process.exit(result.status && rsyncResult.status);
