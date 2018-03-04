var _require = require("../utils"),
    resolveKcdScripts = _require.resolveKcdScripts,
    resolveBin = _require.resolveBin,
    isOptedOut = _require.isOptedOut;

var kcdScripts = resolveKcdScripts();
module.exports = {
  concurrent: false,
  linters: {
    //".all-contributorsrc": [`${kcdScripts} contributors generate`, "git add README.md"],
    "README.md": [`${kcdScripts} doc`, "git add"],
    "**/*.+(js|json|less|css|ts|md)": [isOptedOut("autoformat", null, `${kcdScripts} format`), `${kcdScripts} lint`, `${kcdScripts} test --findRelatedTests --passWithNoTests`, isOptedOut("autoformat", null, "git add")].filter(Boolean)
  }
};
//# sourceMappingURL=lintstagedrc.js.map