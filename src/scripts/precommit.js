const path = require("path");
const spawn = require("cross-spawn");
const { isOptedIn, hasPkgProp, hasFile, resolveBin } = require("../utils");

const here = p => path.join(__dirname, p);
const hereRelative = p => here(p).replace(process.cwd(), ".");

const args = process.argv.slice(2);

console.log("Building doc...");
const docResult = spawn.sync("npm", ["run", "build:doc"]);
if (docResult.status !== 0) {
  process.exit(docResult.status);
}

console.log("Adding doc to git...");
const stageDoc = spawn.sync("git", ["add", "README.md"]);
if (stageDoc.status !== 0) {
  process.exit(stageDoc.status);
}

const useBuiltInConfig =
  !args.includes("--config") && !hasFile(".lintstagedrc") && !hasFile("lint-staged.config.js") && !hasPkgProp("lint-staged");

const config = useBuiltInConfig ? ["--config", hereRelative("../config/lintstagedrc.js")] : [];

const lintStagedResult = spawn.sync(resolveBin("lint-staged"), [...config, ...args], { stdio: "inherit" });

if (lintStagedResult.status !== 0 || !isOptedIn("pre-commit")) {
  process.exit(lintStagedResult.status);
} else {
  const validateResult = spawn.sync("npm", ["run", "validate"], {
    stdio: "inherit",
  });

  process.exit(validateResult.status);
}
