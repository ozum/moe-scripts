var _require = require("../utils"),
    ifAnyDep = _require.ifAnyDep,
    parseEnv = _require.parseEnv;

var isTest = (process.env.BABEL_ENV || process.env.NODE_ENV) === "test";
var isPreact = parseEnv("BUILD_PREACT", false);
var isRollup = parseEnv("BUILD_ROLLUP", false);
var isUMD = process.env.BUILD_FORMAT === "umd";
var isWebpack = parseEnv("BUILD_WEBPACK", false);
var treeshake = parseEnv("BUILD_TREESHAKE", isRollup || isWebpack);
var alias = parseEnv("BUILD_ALIAS", isPreact ? {
  react: "preact"
} : null);
var envTargets = isTest ? {
  node: "current"
} : isWebpack || isRollup ? {
  browsers: ["ie 10", "ios 7"]
} : {
  node: "4.5"
};
var envOptions = {
  modules: false,
  loose: true,
  targets: envTargets
};

module.exports = function (api, opts) {
  if (opts === void 0) {
    opts = {};
  }

  return {
    presets: [[require.resolve("@babel/preset-env"), envOptions], ifAnyDep(["react", "preact"], require.resolve("@babel/preset-react"))].filter(Boolean),
    plugins: [require.resolve("babel-macros"), isRollup ? require.resolve("@babel/plugin-external-helpers") : null, // we're actually not using JSX at all, but I'm leaving this
    // in here just in case we ever do (this would be easy to miss).
    alias ? [require.resolve("babel-plugin-module-resolver"), {
      root: ["./src"],
      alias
    }] : null, isPreact ? [require.resolve("babel-plugin-transform-react-jsx"), {
      pragma: "h"
    }] : null, [require.resolve("babel-plugin-transform-react-remove-prop-types"), isPreact ? {
      removeImport: true
    } : {
      mode: "unsafe-wrap"
    }], isUMD ? require.resolve("babel-plugin-transform-inline-environment-variables") : null, // TODO: use loose mode when upgrading to babel@7
    require.resolve("@babel/plugin-proposal-class-properties"), require.resolve("@babel/plugin-proposal-object-rest-spread"), require.resolve("babel-plugin-minify-dead-code-elimination"), treeshake ? null : require.resolve("@babel/plugin-transform-modules-commonjs")].filter(Boolean)
  };
};
//# sourceMappingURL=babelrc.js.map