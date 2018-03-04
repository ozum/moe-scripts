var _require = require('../../utils-moe'),
    isTypeScript = _require.isTypeScript;

if (process.argv.includes("--browser")) {
  console.error("--browser has been deprecated, use --bundle instead");
}

if (process.argv.includes("--bundle") || process.argv.includes("--browser")) {
  require("./rollup");
} else {
  var builder = isTypeScript ? "./tsc" : "./babel";

  require(builder);
}
//# sourceMappingURL=index.js.map