var path = require("path");

var spawn = require("cross-spawn");

var glob = require("glob");

var _process$argv = process.argv,
    executor = _process$argv[0],
    ignoredBin = _process$argv[1],
    script = _process$argv[2],
    args = _process$argv.slice(3);

if (script) {
  spawnScript();
} else {
  var scriptsPath = path.join(__dirname, "scripts/");
  var scriptsAvailable = glob.sync(path.join(__dirname, "scripts", "*")); // `glob.sync` returns paths with unix style path separators even on Windows.
  // So we normalize it before attempting to strip out the scripts path.

  var scriptsAvailableMessage = scriptsAvailable.map(path.normalize).map(function (s) {
    return s.replace(scriptsPath, "").replace(/__tests__/, "").replace(/\.js$/, "");
  }).filter(Boolean).join("\n  ").trim();
  var fullMessage = `
Usage: ${ignoredBin} [script] [--flags]

Available Scripts:
  ${scriptsAvailableMessage}

Options:
  All options depend on the script. Docs will be improved eventually, but for most scripts you can assume that the args you pass will be forwarded to the respective tool that's being run under the hood.

May the force be with you.
  `.trim();
  console.log(`\n${fullMessage}\n`);
}

function getEnv() {
  // this is required to address an issue in cross-spawn
  // https://github.com/kentcdodds/moe-scripts/issues/4
  return Object.keys(process.env).filter(function (key) {
    return process.env[key] !== undefined;
  }).reduce(function (envCopy, key) {
    envCopy[key] = process.env[key];
    return envCopy;
  }, {
    [`SCRIPTS_${script.toUpperCase()}`]: true
  });
}

function spawnScript() {
  var relativeScriptPath = path.join(__dirname, "./scripts", script);
  var scriptPath = attemptResolve(relativeScriptPath);

  if (!scriptPath) {
    throw new Error(`Unknown script "${script}".`);
  }

  var result = spawn.sync(executor, [scriptPath].concat(args), {
    stdio: "inherit",
    env: getEnv()
  });

  if (result.signal) {
    handleSignal(result);
  } else {
    process.exit(result.status);
  }
}

function handleSignal(result) {
  if (result.signal === "SIGKILL") {
    console.log(`The script "${script}" failed because the process exited too early. ` + "This probably means the system ran out of memory or someone called " + "`kill -9` on the process.");
  } else if (result.signal === "SIGTERM") {
    console.log(`The script "${script}" failed because the process exited too early. ` + "Someone might have called `kill` or `killall`, or the system could " + "be shutting down.");
  }

  process.exit(1);
}

function attemptResolve() {
  try {
    var _require;

    return (_require = require).resolve.apply(_require, arguments);
  } catch (error) {
    return null;
  }
}
//# sourceMappingURL=run-script.js.map