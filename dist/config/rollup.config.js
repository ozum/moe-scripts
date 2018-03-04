var path = require('path');

var camelcase = require('lodash.camelcase');

var rollupBabel = require('rollup-plugin-babel');

var commonjs = require('rollup-plugin-commonjs');

var nodeResolve = require('rollup-plugin-node-resolve');

var json = require('rollup-plugin-json');

var replace = require('rollup-plugin-replace');

var uglify = require('rollup-plugin-uglify');

var nodeBuiltIns = require('rollup-plugin-node-builtins');

var nodeGlobals = require('rollup-plugin-node-globals');

var omit = require('lodash.omit');

var _require = require('../utils'),
    pkg = _require.pkg,
    hasFile = _require.hasFile,
    hasPkgProp = _require.hasPkgProp,
    parseEnv = _require.parseEnv,
    ifFile = _require.ifFile;

var here = function (p) {
  return path.join(__dirname, p);
};

var capitalize = function (s) {
  return s[0].toUpperCase() + s.slice(1);
};

var minify = parseEnv('BUILD_MINIFY', false);
var format = process.env.BUILD_FORMAT;
var isPreact = parseEnv('BUILD_PREACT', false);
var isNode = parseEnv('BUILD_NODE', false);
var name = process.env.BUILD_NAME || capitalize(camelcase(pkg.name));
var defaultGlobals = Object.keys(pkg.peerDependencies || {}).reduce(function (deps, dep) {
  deps[dep] = capitalize(camelcase(dep));
  return deps;
}, {});
var defaultExternal = Object.keys(pkg.peerDependencies || {});
var input = process.env.BUILD_INPUT || ifFile(`src/${format}-entry.js`, `src/${format}-entry.js`, 'src/index.js');
var filenameSuffix = process.env.BUILD_FILENAME_SUFFIX || '';
var filenamePrefix = process.env.BUILD_FILENAME_PREFIX || (isPreact ? 'preact/' : '');
var globals = parseEnv('BUILD_GLOBALS', isPreact ? Object.assign(defaultGlobals, {
  preact: 'preact'
}) : defaultGlobals);
var external = parseEnv('BUILD_EXTERNAL', isPreact ? defaultExternal.concat(['preact', 'prop-types']) : defaultExternal).filter(function (e, i, arry) {
  return arry.indexOf(e) === i;
});

if (isPreact) {
  delete globals.react;
  delete globals['prop-types']; // TODO: is this necessary?

  external.splice(external.indexOf('react'), 1);
}

var externalPattern = new RegExp(`^(${external.join('|')})($|/)`);
var externalPredicate = external.length === 0 ? function () {
  return false;
} : function (id) {
  return externalPattern.test(id);
};
var esm = format === 'esm';
var umd = format === 'umd';
var filename = [pkg.name, filenameSuffix, `.${format}`, minify ? '.min' : null, '.js'].filter(Boolean).join('');
var filepath = path.join.apply(path, [filenamePrefix, 'dist', filename].filter(Boolean));
var output = [{
  name,
  file: filepath,
  format: esm ? 'es' : format,
  exports: esm ? 'named' : 'default',
  globals
}];
var useBuiltinConfig = !hasFile('.babelrc') && !hasPkgProp('babel');
var babelPresets = useBuiltinConfig ? [here('../config/babelrc.js')] : [];
var replacements = Object.entries(umd ? process.env : omit(process.env, ['NODE_ENV'])).reduce(function (acc, _ref) {
  var key = _ref[0],
      value = _ref[1];
  var val;

  if (value === 'true' || value === 'false' || Number.isInteger(+value)) {
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
  plugins: [isNode ? nodeBuiltIns() : null, isNode ? nodeGlobals() : null, nodeResolve({
    preferBuiltins: isNode,
    jsnext: true,
    main: true
  }), commonjs({
    include: 'node_modules/**'
  }), json(), rollupBabel({
    exclude: 'node_modules/**',
    presets: babelPresets,
    babelrc: true
  }), replace(replacements), minify ? uglify() : null].filter(Boolean)
};
//# sourceMappingURL=rollup.config.js.map