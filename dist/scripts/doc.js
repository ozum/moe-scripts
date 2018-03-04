var fs = require("fs");

var path = require("path");

var spawn = require("cross-spawn");

var _require = require("../utils-moe"),
    isTypeScript = _require.isTypeScript;

var _require2 = require("../utils"),
    hasPkgProp = _require2.hasPkgProp,
    resolveBin = _require2.resolveBin,
    hasFile = _require2.hasFile;

var args = process.argv.slice(2);

var here = function (p) {
  return path.join(__dirname, p);
};

var extension = isTypeScript ? "ts" : "js";
var useBuiltinConfig = !args.includes("--configure") && !hasFile(".jsdoc2md.json") && !hasPkgProp("jsdoc2md");
var builtinConfigFile = here(`../config/jsdoc2md/${extension}.json`);
var files = !args.includes("--files") ? ["--files", `src/**/*.${extension}`] : [];
var config = useBuiltinConfig ? ["--configure", builtinConfigFile] : [];
var template = !args.includes("--template") || hasFile("README.hbs") ? ["--template", "README.hbs"] : [];
var outputFile = fs.openSync('README.md', 'w');
var result = spawn.sync(resolveBin("jsdoc-to-markdown", {
  executable: "jsdoc2md"
}), config.concat(template, files).concat(args), {
  stdio: ['inherit', outputFile, 'inherit'],
  encoding: 'utf-8'
});
var doctoc = spawn.sync(resolveBin("doctoc", {
  executable: "doctoc"
}), ['README.md'], {
  stdio: 'inherit'
});
process.exit(result.status || doctoc.status);
//# sourceMappingURL=doc.js.map