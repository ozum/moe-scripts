const project = require("../project");

const isTest = (process.env.BABEL_ENV || process.env.NODE_ENV) === "test";
const isPreact = project.parseEnv("BUILD_PREACT", false);
const isRollup = project.parseEnv("BUILD_ROLLUP", false);
const isUMD = process.env.BUILD_FORMAT === "umd";
const isWebpack = project.parseEnv("BUILD_WEBPACK", false);
const treeshake = project.parseEnv("BUILD_TREESHAKE", isRollup || isWebpack);
const alias = project.parseEnv("BUILD_ALIAS", isPreact ? { react: "preact" } : null);

const envTargets = isTest ? { node: "current" } : isWebpack || isRollup ? { browsers: ["ie 10", "ios 7"] } : { node: "4.5" };
const envOptions = { modules: false, loose: true, targets: envTargets };

module.exports = function preset(api, opts = {}) {
  // eslint-disable-line no-unused-vars
  return {
    presets: [
      [require.resolve("@babel/preset-env"), envOptions],
      project.hasAnyDep(["react", "preact"], require.resolve("@babel/preset-react")),
    ].filter(Boolean),
    plugins: [
      require.resolve("babel-plugin-macros"),
      isRollup ? require.resolve("@babel/plugin-external-helpers") : null,
      // we're actually not using JSX at all, but I'm leaving this
      // in here just in case we ever do (this would be easy to miss).
      alias ? [require.resolve("babel-plugin-module-resolver"), { alias, root: ["./src"] }] : null,
      isPreact ? [require.resolve("babel-plugin-transform-react-jsx"), { pragma: "h" }] : null,
      [require.resolve("babel-plugin-transform-react-remove-prop-types"), isPreact ? { removeImport: true } : { mode: "unsafe-wrap" }],
      isUMD ? require.resolve("babel-plugin-transform-inline-environment-variables") : null,
      // TODO: use loose mode when upgrading to babel@7
      require.resolve("@babel/plugin-proposal-class-properties"),
      require.resolve("@babel/plugin-proposal-object-rest-spread"),
      require.resolve("babel-plugin-minify-dead-code-elimination"),
      treeshake ? null : require.resolve("@babel/plugin-transform-modules-commonjs"),
    ].filter(Boolean),
  };
};
