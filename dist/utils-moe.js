var fs = require("fs");

var path = require("path");

var chalk = require("chalk");

var writeJsonFile = require('write-json-file');

var _require = require("./utils"),
    fromRoot = _require.fromRoot,
    hasPkgProp = _require.hasPkgProp,
    pkg = _require.pkg;

var set = require("lodash.set");

var yargsParser = require("yargs-parser");

var isTypeScript = hasPkgProp('types');
var mark = {
  check: chalk.green("✔"),
  cross: chalk.red("✕"),
  warn: chalk.yellow("O")
};
/**
 * Logs given message
 * @param {string}  message         - Message to log
 * @param {Object}  [options]       - Options
 * @param {boolean} [options.log]   - If true, emits output to console.
 * @param {string}  [options.mark]  - Mark to put at the beginning of message.
 */

function logMessage(message, options) {
  if (options.mark && !mark[options.mark]) {
    throw new Error('Wrong mark option');
  }

  var pre = options.mark ? `${mark[options.mark]} ` : '';

  if (options && options.log) {
    console.log(`${pre} ${message}`);
  }
}
/**
 * Returns index of output destination argument name (not value) of given array.
 * Considers all possible acceptable names among compatible tools of this toolkit.
 * If there isn't any, returns -1.
 * @param   {Array} args  - Array to get position from
 * @returns {number}      - Index position of argument name, -1 if none found.
 * @example
 * getOutDestinationIndex(['.', '.', '--outDir': '...']); // 2
 * getOutDestinationIndex(['--out-dir': '...']);          // 1
 */


function getOutDestinationIndex(args) {
  var index = args.indexOf("--outDir");
  if (index > -1) return index;
  index = args.indexOf("--out-dir");
  if (index > -1) return index;
  return -1;
}
/**
 * Returns a new array, after replacing output destination argument name with a new name.
 * Does not mutate original array. Used to normalize different builders' parameters.
 * As a result, it is possible to change build tool without changing output destination argument name.
 * If args does not contain output destination, return
 * @param   {Array}   args    - Arguments to normalize
 * @param   {string}  argName - Argument name to use for destination parameter.
 * @returns {Array}           - A new array with given parameter name.
 * @example
 * normalizeOutDestination(['--outDir': '...'], '--out-dir');  // [ '--out-dir': '...' ]
 * normalizeOutDestination(['--out-dir': '...'], '--out-dir'); // [ '--out-dir': '...' ]
 */


function normalizeOutDestination(args, argName) {
  var result = args.concat();
  var index = getOutDestinationIndex(result);

  if (index > -1 && result[index] !== argName) {
    result.splice(result, 1, argName);
  }

  return result;
}
/**
 * Creates a symbolic link from created file to target file using relative path.
 * Path of file to be created should be given relative to project path.
 * @param {string}  target                - Target file which link points to.
 * @param {string}  projectFile           - File path to relative to project root.
 * @param {Object}  [options]             - Options
 * @param {boolean} [options.log=true]    - Emits output to console.
 * @param {boolean} [options.force=false] - Writes file even it exists and it is a symlink. (Does not delete non-symlink)
 * @example
 * // Creates tsconfig.json symbolic link file in project root, pointing to a file from toolkit.
 * createSymLink(here('../../config.json'), 'tsconfig.json');
 */


function createSymLink(target, projectFile, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$force = _ref.force,
      force = _ref$force === void 0 ? false : _ref$force,
      _ref$log = _ref.log,
      log = _ref$log === void 0 ? true : _ref$log;

  var type = fs.lstatSync(target).isDirectory() ? "dir" : "file";
  var linkType = type === 'dir' ? 'absolute' : 'relative';
  var targetPath = type === "dir" ? path.resolve(target) : path.relative(fromRoot(), target);
  var sourcePath = fromRoot(projectFile);

  if (fs.existsSync(sourcePath) && force && fs.lstatSync(sourcePath).isSymbolicLink()) {
    fs.unlinkSync(sourcePath);
    logMessage(`Deleted Symbolic Link (force): ${projectFile}`, {
      log,
      mark: 'check'
    });
  }

  if (!fs.existsSync(sourcePath)) {
    fs.symlinkSync(targetPath, sourcePath, type);
    logMessage(`Created Symbolic Link (${linkType}): ${projectFile} -> ${targetPath}`, {
      log,
      mark: 'check'
    });
  } else {
    logMessage(`Skipped Symbolic Link (File exists): ${projectFile}`, {
      log,
      mark: 'warn'
    });
  }
}
/**
 * Creates and writes given data to a file in project.
 * @param {string}  projectFile           - File path to relative to project root.
 * @param {string}  data                  - Data to write
 * @param {Object}  [options]             - Options
 * @param {boolean} [options.log=true]    - Emits output to console.
 * @param {boolean} [options.force=false] - Writes file even it exists.
 */


function createFile(projectFile, data, _temp2) {
  var _ref2 = _temp2 === void 0 ? {} : _temp2,
      _ref2$force = _ref2.force,
      force = _ref2$force === void 0 ? false : _ref2$force,
      _ref2$log = _ref2.log,
      log = _ref2$log === void 0 ? true : _ref2$log;

  var filePath = fromRoot(projectFile);

  if (fs.existsSync(filePath) && force) {
    fs.unlinkSync(filePath);
    logMessage(`Deleted File (force): ${projectFile}`, {
      log,
      mark: 'check'
    });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, data);
    logMessage(`Created File: ${projectFile}`, {
      log,
      mark: 'check'
    });
  } else {
    logMessage(`Skipped File (File exists): ${projectFile}`, {
      log,
      mark: 'warn'
    });
  }
}
/**
 * Copeis given file to path given relative to project directory.
 * @param {string}  source                - Source file to copy
 * @param {string}  projectFile           - File path to relative to project root.
 * @param {Object}  [options]             - Options
 * @param {boolean} [options.log=true]    - Emits output to console.
 * @param {boolean} [options.force=false] - Writes file even it exists.
 */


function copyFile(source, projectFile, _temp3) {
  var _ref3 = _temp3 === void 0 ? {} : _temp3,
      _ref3$force = _ref3.force,
      force = _ref3$force === void 0 ? false : _ref3$force,
      _ref3$log = _ref3.log,
      log = _ref3$log === void 0 ? true : _ref3$log;

  var filePath = fromRoot(projectFile);
  var fileExists = fs.existsSync(filePath);

  if (fileExists && !force) {
    logMessage(`Skipped File Copy: ${source} -> ${projectFile}`, {
      log,
      mark: 'warn'
    });
  }

  if (!fileExists || force) {
    fs.copyFileSync(source, filePath);
    logMessage(`Copied File: ${source} -> ${projectFile}`, {
      log,
      mark: 'check'
    });
  }
}
/**
 * Creates a file and writes given object as JSON data to file whose path is relative to project's root.
 * If file exists it does not create file.
 * @param {string}  file                  - File path to create
 * @param {Object}  data                  - Data to write as JSON
 * @param {Object}  [options]             - Options
 * @param {boolean} [options.log=true]    - Emits output to console.
 * @param {boolean} [options.force=false] - Writes file even it exists.
 */


function writeJson(file, data, _temp4) {
  var _ref4 = _temp4 === void 0 ? {} : _temp4,
      _ref4$force = _ref4.force,
      force = _ref4$force === void 0 ? false : _ref4$force,
      _ref4$log = _ref4.log,
      log = _ref4$log === void 0 ? true : _ref4$log;

  var filePath = fromRoot(file);

  if (!fs.existsSync(filePath) || force) {
    writeJsonFile.sync(filePath, data, {
      indent: 2
    });
    logMessage(`Written JSON File: ${file}`, {
      log,
      mark: 'check'
    });
  } else {
    logMessage(`Skipped JSON File (File exists): ${file}`, {
      log,
      mark: 'warn'
    });
  }
}
/**
 * Updates key with given value in project's package.json.
 * @param {Object}  data                  - Data to set in package.json (Keys are key paths, values are values)
 * @param {Object}  [options]             - Options
 * @param {boolean} [options.log=true]    - Emits output to console.
 * @param {boolean} [options.force=false] - Sets key even if exists.
 * @example
 * setPkg({
 *   "scripts.lint": "moe-scripts lint",
 *   "scripts.test": "moe-scripts test",
 * });
 */


function setPkg(data, _temp5) {
  var _ref5 = _temp5 === void 0 ? {} : _temp5,
      _ref5$force = _ref5.force,
      force = _ref5$force === void 0 ? false : _ref5$force,
      _ref5$log = _ref5.log,
      log = _ref5$log === void 0 ? true : _ref5$log;

  var updatedKeys = [];
  var skippedKeys = [];
  Object.keys(data).forEach(function (key) {
    if (!hasPkgProp(key) || force) {
      updatedKeys.push(key);
      set(pkg, key, data[key]);
    } else {
      skippedKeys.push(key);
    }
  });

  if (skippedKeys.length > 0) {
    logMessage(`Following keys are not updated in package.json (they exist): ${skippedKeys.join(', ')}.`, {
      log,
      mark: 'warn'
    });
  }

  if (updatedKeys.length > 0) {
    logMessage(`Following keys are updated in package.json: ${updatedKeys.join(', ')}.`, {
      log,
      mark: 'check'
    });
    writeJson('package.json', pkg, {
      force: true
    });
  }
}
/**
 * Creates symbolic link to given module in node_modules directory of project
 * @param {string} name - Name of the module.
 */


function createModuleSymLink(name) {
  var modulePath = path.resolve(path.join(require.resolve(`${name}/package.json`), ".."));
  createSymLink(modulePath, `node_modules/${name}`, {
    force: true
  });
}

module.exports = {
  normalizeOutDestination,
  createSymLink,
  writeJson,
  createFile,
  copyFile,
  logMessage,
  isTypeScript,
  setPkg,
  createModuleSymLink
};
//# sourceMappingURL=utils-moe.js.map