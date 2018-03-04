const fs = require("fs");
const path = require("path");
const spawn = require("cross-spawn");
const { isTypeScript } = require("../utils-moe");
const { hasPkgProp, resolveBin, hasFile } = require("../utils");

const args = process.argv.slice(2);

const here = p => path.join(__dirname, p);
const extension = isTypeScript ? "ts" : "js";

const useBuiltinConfig = !args.includes("--configure") && !hasFile(".jsdoc2md.json") && !hasPkgProp("jsdoc2md");
const builtinConfigFile = here(`../config/jsdoc2md/${extension}.json`);

const files = !args.includes("--files") ? ["--files", `src/**/*.${extension}`] : [];
const config = useBuiltinConfig ? ["--configure", builtinConfigFile] : [];
const template = !args.includes("--template") || hasFile("README.hbs") ? ["--template", "README.hbs"] : [];


const outputFile = fs.openSync('README.md', 'w');

const result = spawn.sync(
  resolveBin("jsdoc-to-markdown", { executable: "jsdoc2md" }),
  [...config, ...template, ...files].concat(args),
  { stdio: ['inherit', outputFile, 'inherit'], encoding: 'utf-8' },
);

const doctoc = spawn.sync(
  resolveBin("doctoc", { executable: "doctoc" }),
  ['README.md'],
  { stdio: 'inherit' },
);

process.exit(result.status || doctoc.status);
