process.env.BABEL_ENV = "test";
process.env.NODE_ENV = "test";

var isCI = require("is-ci");

var _require = require("../utils"),
    hasPkgProp = _require.hasPkgProp,
    parseEnv = _require.parseEnv,
    hasFile = _require.hasFile;

var args = process.argv.slice(2);
var watch = !isCI && !parseEnv("SCRIPTS_PRECOMMIT", false) && !args.includes("--no-watch") && !args.includes("--coverage") && !args.includes("--updateSnapshot") ? ["--watch"] : [];
var config = !args.includes("--config") && !hasFile("jest.config.js") && !hasPkgProp("jest") ? ["--config", JSON.stringify(require("../config/jest.config"))] : [];

require("jest").run(config.concat(watch, args));
//# sourceMappingURL=test.js.map