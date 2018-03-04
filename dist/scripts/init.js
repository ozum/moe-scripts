/**
 * --target frontend | backend | compiled (Mulitple selection)
 */
require("source-map-support").install();

var mkdirp = require("mkdirp");

var path = require("path");

var fs = require("fs");

var yargsParser = require("yargs-parser");

var handlebars = require("handlebars");

var _require = require("../utils-moe"),
    isTypeScript = _require.isTypeScript,
    createSymLink = _require.createSymLink,
    createFile = _require.createFile,
    copyFile = _require.copyFile,
    writeJson = _require.writeJson,
    createModuleSymLink = _require.createModuleSymLink,
    setPkg = _require.setPkg;

var _require2 = require("../utils"),
    pkg = _require2.pkg; // const { outDir, create, customize } = require("./utils");


var args = process.argv.slice(2);
var parsedArgs = yargsParser(args, {
  array: ["target"]
});
var isCompiled = (parsedArgs.target || []).includes("compiled") || isTypeScript;
var isBackend = !(parsedArgs.target || []).includes("frontend");
var outDir = isBackend ? "lib" : "dist"; //const here = p => path.join(__dirname, p);

var configFile = function (p) {
  return path.join(__dirname, "../config", p);
};

var gitignoreFile = isCompiled ? "compile" : "non-compile";
setPkg({
  "scripts.build": `moe-scripts build${isTypeScript ? '' : ' --source-maps'}`,
  "scripts.build:doc": `moe-scripts doc --no-cache`,
  "scripts.test": "moe-scripts test",
  "scripts.test:update": "moe-scripts test --updateSnapshot",
  "scripts.lint": "moe-scripts lint",
  "scripts.format": "moe-scripts format",
  "scripts.validate": "moe-scripts validate",
  "scripts.precommit": "moe-scripts precommit",
  "scripts.postversion": "git push && git push --tags && npm publish",
  "scripts.prepublishOnly": "npm run build"
});
mkdirp.sync("node_modules/@types");
createModuleSymLink("@types/jest");
createModuleSymLink("@types/node");
createFile(".env", "");
createFile(".env.sample", "# Description\n# VAR='value'\n");
createSymLink(configFile(`gitignore/${gitignoreFile}`), ".gitignore", {
  force: true
});
createSymLink(configFile(`gitattributes`), ".gitattributes", {
  force: true
});
copyFile(configFile("changelog.md"), "CHANGELOG.md");
createFile("LICENSE", "");
createFile("README.hbs", handlebars.compile(fs.readFileSync(configFile("readme.hbs"), {
  encoding: "utf8"
}))(pkg));
createFile(".prettierrc.js", 'module.exports = require("moe-scripts/.prettierrc.js");\n'); // lint
// Create node_modules/module symlink for IDE support and config file if not exists.

if (isTypeScript) {
  createModuleSymLink("tslint");
  writeJson("tslint.json", {
    extends: "moe-scripts/tslint-backend.json"
  });
} else {
  createModuleSymLink("eslint");
  writeJson(".eslintrc", {
    extends: "./node_modules/moe-scripts/eslint.js"
  });
} // compiler


if (isTypeScript) {
  createSymLink(configFile("tsconfig/backend.json"), "tsconfig.json");
  createSymLink(configFile("tsconfig/backend-test.json"), "tsconfig-test.json");
} // Format


createModuleSymLink("prettier");
createModuleSymLink("ts-jest");
//# sourceMappingURL=init.js.map