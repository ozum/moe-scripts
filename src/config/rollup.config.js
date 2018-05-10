const path = require("path");
const camelcase = require("lodash.camelcase");
const rollupBabel = require("rollup-plugin-babel");
const commonjs = require("rollup-plugin-commonjs");
const nodeResolve = require("rollup-plugin-node-resolve");
const json = require("rollup-plugin-json");
const replace = require("rollup-plugin-replace");
const uglify = require("rollup-plugin-uglify");
const nodeBuiltIns = require("rollup-plugin-node-builtins");
const nodeGlobals = require("rollup-plugin-node-globals");
const omit = require("lodash.omit");
const project = require("../project");

const here = p => path.join(__dirname, p);
const capitalize = s => s[0].toUpperCase() + s.slice(1);

const minify = project.parseEnv("BUILD_MINIFY", false);
const format = process.env.BUILD_FORMAT;
const isPreact = project.parseEnv("BUILD_PREACT", false);
const isNode = project.parseEnv("BUILD_NODE", false);
const name = process.env.BUILD_NAME || capitalize(camelcase(project.name));

const defaultGlobals = Object.keys(project.package.get("peerDependencies") || {}).reduce((deps, dep) => {
  deps[dep] = capitalize(camelcase(dep)); // eslint-disable-line no-param-reassign
  return deps;
}, {});

const defaultExternal = Object.keys(project.package.get("peerDependencies") || {});

const input = process.env.BUILD_INPUT || project.hasFileSync(`src/${format}-entry.js`, `src/${format}-entry.js`, "src/index.js");

const filenameSuffix = process.env.BUILD_FILENAME_SUFFIX || "";
const filenamePrefix = process.env.BUILD_FILENAME_PREFIX || (isPreact ? "preact/" : "");
const globals = project.parseEnv("BUILD_GLOBALS", isPreact ? Object.assign(defaultGlobals, { preact: "preact" }) : defaultGlobals);
const external = project
  .parseEnv("BUILD_EXTERNAL", isPreact ? defaultExternal.concat(["preact", "prop-types"]) : defaultExternal)
  .filter((e, i, arry) => arry.indexOf(e) === i);

if (isPreact) {
  delete globals.react;
  delete globals["prop-types"]; // TODO: is this necessary?
  external.splice(external.indexOf("react"), 1);
}

const externalPattern = new RegExp(`^(${external.join("|")})($|/)`);
const externalPredicate = external.length === 0 ? () => false : id => externalPattern.test(id);

const esm = format === "esm";
const umd = format === "umd";

const filename = [project.name, filenameSuffix, `.${format}`, minify ? ".min" : null, ".js"].filter(Boolean).join("");

const filepath = path.join(...[filenamePrefix, "dist", filename].filter(Boolean));

const output = [
  {
    name,
    globals,
    file: filepath,
    format: esm ? "es" : format,
    exports: esm ? "named" : "default",
  },
];

const useBuiltinConfig = !project.hasFileSync(".babelrc") && !project.package.has("babel");
const babelPresets = useBuiltinConfig ? [here("./babelrc.js")] : [];

const replacements = Object.entries(umd ? process.env : omit(process.env, ["NODE_ENV"])).reduce((acc, [key, value]) => {
  let val;
  if (value === "true" || value === "false" || Number.isInteger(+value)) {
    val = value;
  } else {
    val = JSON.stringify(value);
  }
  acc[`process.env.${key}`] = val;
  return acc;
}, {});

module.exports = {
  input,
  output,
  external: externalPredicate,
  plugins: [
    isNode ? nodeBuiltIns() : null,
    isNode ? nodeGlobals() : null,
    nodeResolve({ preferBuiltins: isNode, jsnext: true, main: true }),
    commonjs({ include: "node_modules/**" }),
    json(),
    rollupBabel({
      exclude: "node_modules/**",
      presets: babelPresets,
      babelrc: true,
    }),
    replace(replacements),
    minify ? uglify() : null,
  ].filter(Boolean),
};
