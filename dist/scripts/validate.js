var spawn = require("cross-spawn");

var _require = require("../utils"),
    parseEnv = _require.parseEnv,
    resolveBin = _require.resolveBin,
    ifScript = _require.ifScript,
    getConcurrentlyArgs = _require.getConcurrentlyArgs;

var _require2 = require("../utils-moe"),
    isTypeScript = _require2.isTypeScript; // precommit runs linting and tests on the relevant files
// so those scripts don't need to be run if we're running
// this in the context of a precommit hook.


var precommit = parseEnv("SCRIPTS_PRECOMMIT", false);
var validateScripts = process.argv[2];
var useDefaultScripts = typeof validateScripts !== "string";
var scripts = useDefaultScripts ? {
  // build: ifScript("build", "npm run build --silent"),
  lint: precommit ? null : ifScript("lint", "npm run lint --silent"),
  test: precommit ? null : ifScript("test", "npm run test --silent -- --coverage"),
  flow: ifScript("flow", "npm run flow --silent"),
  typescript: isTypeScript ? `${resolveBin("tsc")} --noemit` : null,
  nsp: precommit ? `${resolveBin("nsp")} check` : null
} : validateScripts.split(",").reduce(function (scriptsToRun, name) {
  scriptsToRun[name] = `npm run ${name} --silent`;
  return scriptsToRun;
}, {});
var result = spawn.sync(resolveBin("concurrently"), getConcurrentlyArgs(scripts), {
  stdio: "inherit"
});
process.exit(result.status);
//# sourceMappingURL=validate.js.map