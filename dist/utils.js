var fs = require('fs');

var path = require('path');

var arrify = require('arrify');

var has = require('lodash.has');

var readPkgUp = require('read-pkg-up');

var which = require('which');

var _readPkgUp$sync = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd())
}),
    pkg = _readPkgUp$sync.pkg,
    pkgPath = _readPkgUp$sync.path;

var appDirectory = path.dirname(pkgPath);

function resolveKcdScripts() {
  if (pkg.name === 'moe-scripts') {
    return require.resolve('./').replace(process.cwd(), '.');
  }

  return resolveBin('moe-scripts');
} // eslint-disable-next-line complexity


function resolveBin(modName, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$executable = _ref.executable,
      executable = _ref$executable === void 0 ? modName : _ref$executable,
      _ref$cwd = _ref.cwd,
      cwd = _ref$cwd === void 0 ? process.cwd() : _ref$cwd;

  var pathFromWhich;

  try {
    pathFromWhich = fs.realpathSync(which.sync(executable));
  } catch (_error) {// ignore _error
  }

  try {
    var modPkgPath = require.resolve(`${modName}/package.json`);

    var modPkgDir = path.dirname(modPkgPath);

    var _require = require(modPkgPath),
        bin = _require.bin;

    var binPath = typeof bin === 'string' ? bin : bin[executable];
    var fullPathToBin = path.join(modPkgDir, binPath);

    if (fullPathToBin === pathFromWhich) {
      return executable;
    }

    return fullPathToBin.replace(cwd, '.');
  } catch (error) {
    if (pathFromWhich) {
      return executable;
    }

    throw error;
  }
}

var fromRoot = function () {
  for (var _len = arguments.length, p = new Array(_len), _key = 0; _key < _len; _key++) {
    p[_key] = arguments[_key];
  }

  return path.join.apply(path, [appDirectory].concat(p));
};

var hasFile = function () {
  return fs.existsSync(fromRoot.apply(void 0, arguments));
};

var ifFile = function (files, t, f) {
  return arrify(files).some(function (file) {
    return hasFile(file);
  }) ? t : f;
};

var hasPkgProp = function (props) {
  return arrify(props).some(function (prop) {
    return has(pkg, prop);
  });
};

var hasPkgSubProp = function (pkgProp) {
  return function (props) {
    return hasPkgProp(arrify(props).map(function (p) {
      return `${pkgProp}.${p}`;
    }));
  };
};

var ifPkgSubProp = function (pkgProp) {
  return function (props, t, f) {
    return hasPkgSubProp(pkgProp)(props) ? t : f;
  };
};

var hasScript = hasPkgSubProp('scripts');
var hasPeerDep = hasPkgSubProp('peerDependencies');
var hasDep = hasPkgSubProp('dependencies');
var hasDevDep = hasPkgSubProp('devDependencies');

var hasAnyDep = function (args) {
  return [hasDep, hasDevDep, hasPeerDep].some(function (fn) {
    return fn(args);
  });
};

var ifPeerDep = ifPkgSubProp('peerDependencies');
var ifDep = ifPkgSubProp('dependencies');
var ifDevDep = ifPkgSubProp('devDependencies');

var ifAnyDep = function (deps, t, f) {
  return hasAnyDep(arrify(deps)) ? t : f;
};

var ifScript = ifPkgSubProp('scripts');

function parseEnv(name, def) {
  if (envIsSet(name)) {
    try {
      return JSON.parse(process.env[name]);
    } catch (err) {
      return process.env[name];
    }
  }

  return def;
}

function envIsSet(name) {
  return process.env.hasOwnProperty(name) && process.env[name] && process.env[name] !== 'undefined';
}

function getConcurrentlyArgs(scripts, _temp2) {
  var _ref2 = _temp2 === void 0 ? {} : _temp2,
      _ref2$killOthers = _ref2.killOthers,
      killOthers = _ref2$killOthers === void 0 ? true : _ref2$killOthers;

  var colors = ['bgBlue', 'bgGreen', 'bgMagenta', 'bgCyan', 'bgWhite', 'bgRed', 'bgBlack', 'bgYellow'];
  scripts = Object.entries(scripts).reduce(function (all, _ref3) {
    var name = _ref3[0],
        script = _ref3[1];

    if (script) {
      all[name] = script;
    }

    return all;
  }, {});
  var prefixColors = Object.keys(scripts).reduce(function (pColors, _s, i) {
    return pColors.concat([`${colors[i % colors.length]}.bold.reset`]);
  }, []).join(','); // prettier-ignore

  return [killOthers ? '--kill-others-on-fail' : null, '--prefix', '[{name}]', '--names', Object.keys(scripts).join(','), '--prefix-colors', prefixColors].concat(Object.values(scripts).map(function (s) {
    return JSON.stringify(s);
  })).filter(Boolean);
}

function isOptedOut(key, t, f) {
  if (t === void 0) {
    t = true;
  }

  if (f === void 0) {
    f = false;
  }

  if (!fs.existsSync(fromRoot('.opt-out'))) {
    return f;
  }

  var contents = fs.readFileSync(fromRoot('.opt-out'), 'utf-8');
  return contents.includes(key) ? t : f;
}

function isOptedIn(key, t, f) {
  if (t === void 0) {
    t = true;
  }

  if (f === void 0) {
    f = false;
  }

  if (!fs.existsSync(fromRoot('.opt-in'))) {
    return f;
  }

  var contents = fs.readFileSync(fromRoot('.opt-in'), 'utf-8');
  return contents.includes(key) ? t : f;
}

module.exports = {
  appDirectory,
  envIsSet,
  fromRoot,
  getConcurrentlyArgs,
  hasFile,
  hasPkgProp,
  hasScript,
  ifAnyDep,
  ifDep,
  ifDevDep,
  ifFile,
  ifPeerDep,
  ifScript,
  isOptedIn,
  isOptedOut,
  parseEnv,
  pkg,
  resolveBin,
  resolveKcdScripts
};
//# sourceMappingURL=utils.js.map