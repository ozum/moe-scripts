var path = require("path");

var fs = require("fs");

var spawn = require("cross-spawn");

var mkdirp = require("mkdirp");

var glob = require("glob");

var rimraf = require("rimraf");

var yargsParser = require("yargs-parser");

var _require = require("../../utils"),
    hasFile = _require.hasFile,
    resolveBin = _require.resolveBin,
    fromRoot = _require.fromRoot,
    getConcurrentlyArgs = _require.getConcurrentlyArgs;

var crossEnv = resolveBin("cross-env");
var rollup = resolveBin("rollup");
var args = process.argv.slice(2);

var here = function (p) {
  return path.join(__dirname, p);
};

var hereRelative = function (p) {
  return here(p).replace(process.cwd(), ".");
};

var parsedArgs = yargsParser(args);
var useBuiltinConfig = !args.includes("--config") && !hasFile("rollup.config.js");
var config = useBuiltinConfig ? `--config ${hereRelative("../../config/rollup.config.js")}` : args.includes("--config") ? "" : "--config"; // --config will pick up the rollup.config.js file

var environment = parsedArgs.environment ? `--environment ${parsedArgs.environment}` : "";
var watch = parsedArgs.watch ? "--watch" : "";
var formats = ["esm", "cjs", "umd", "umd.min"];

if (typeof parsedArgs.bundle === "string") {
  formats = parsedArgs.bundle.split(",");
}

var defaultEnv = "BUILD_ROLLUP=true";

var getCommand = function (env) {
  for (var _len = arguments.length, flags = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    flags[_key - 1] = arguments[_key];
  }

  return [crossEnv, defaultEnv, env, rollup, config, environment, watch].concat(flags).filter(Boolean).join(" ");
};

var buildPreact = args.includes("--p-react");
var scripts = buildPreact ? getPReactScripts() : getConcurrentlyArgs(getCommands());
var cleanBuildDirs = !args.includes("--no-clean");

if (cleanBuildDirs) {
  rimraf.sync(fromRoot("dist"));
}

if (buildPreact) {
  if (cleanBuildDirs) {
    rimraf.sync(fromRoot("preact"));
  }

  mkdirp.sync(fromRoot("preact"));
}

var result = spawn.sync(resolveBin("concurrently"), scripts, {
  stdio: "inherit"
});

if (result.status === 0 && buildPreact && !args.includes("--no-package-json")) {
  var preactPkg = fromRoot("preact/package.json");
  var preactDir = fromRoot("preact");
  var cjsFile = glob.sync(fromRoot("preact/**/*.cjs.js"))[0];
  var esmFile = glob.sync(fromRoot("preact/**/*.esm.js"))[0];
  fs.writeFileSync(preactPkg, JSON.stringify({
    main: path.relative(preactDir, cjsFile),
    "jsnext:main": path.relative(preactDir, esmFile),
    module: path.relative(preactDir, esmFile)
  }, null, 2));
}

function getPReactScripts() {
  var reactCommands = prefixKeys("react.", getCommands());
  var preactCommands = prefixKeys("preact.", getCommands({
    preact: true
  }));
  return getConcurrentlyArgs(Object.assign(reactCommands, preactCommands));
}

function prefixKeys(prefix, object) {
  return Object.entries(object).reduce(function (cmds, _ref) {
    var key = _ref[0],
        value = _ref[1];
    cmds[`${prefix}${key}`] = value;
    return cmds;
  }, {});
}

function getCommands(_temp) {
  var _ref2 = _temp === void 0 ? {} : _temp,
      _ref2$preact = _ref2.preact,
      preact = _ref2$preact === void 0 ? false : _ref2$preact;

  return formats.reduce(function (cmds, format) {
    var _format$split = format.split("."),
        formatName = _format$split[0],
        _format$split$ = _format$split[1],
        minify = _format$split$ === void 0 ? false : _format$split$;

    var nodeEnv = minify ? "production" : "development";
    var sourceMap = formatName === "umd" ? "--sourcemap" : "";
    var buildMinify = Boolean(minify);
    cmds[format] = getCommand([`BUILD_FORMAT=${formatName}`, `BUILD_MINIFY=${buildMinify}`, `NODE_ENV=${nodeEnv}`, `BUILD_PREACT=${preact}`, `BUILD_NODE=${process.env.BUILD_NODE || false}`, `BUILD_REACT_NATIVE=${process.env.BUILD_REACT_NATIVE || false}`].join(" "), sourceMap);
    return cmds;
  }, {});
}

process.exit(result.status);
//# sourceMappingURL=rollup.js.map