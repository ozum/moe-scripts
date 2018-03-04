var path = require("path");

var _require = require("../utils"),
    ifAnyDep = _require.ifAnyDep,
    hasFile = _require.hasFile,
    hasPkgProp = _require.hasPkgProp,
    fromRoot = _require.fromRoot;

var _require2 = require("../utils-moe"),
    isTypeScript = _require2.isTypeScript;

var here = function (p) {
  return path.join(__dirname, p);
};

var useBuiltInBabelConfig = !hasFile(".babelrc") && !hasPkgProp("babel");
var ignores = ["/node_modules/", "/fixtures/", "/__tests__/helpers/", "/__test_supplements__/", "/__test_helpers__/", "__mocks__"];
var jestConfig = {
  roots: [fromRoot("src")],
  testEnvironment: ifAnyDep(["webpack", "rollup", "react"], "jsdom", "node"),
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: ["src/**/*.+(js|jsx|ts|tsx)"],
  testMatch: ["**/__tests__/**/*.+(js|jsx|ts|tsx)", "**/*.(test|spec).(js|jsx|ts|tsx)"],
  testPathIgnorePatterns: ignores.concat(),
  coveragePathIgnorePatterns: ignores.concat(["src/(umd|cjs|esm)-entry.js$"]),
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};

if (isTypeScript) {
  jestConfig.transform = {
    "^.+\\.(js|ts|jsx|tsx)$": "ts-jest"
  };
  jestConfig.globals = {
    "ts-jest": {
      tsConfigFile: "tsconfig-test.json"
    }
  };
} else if (useBuiltInBabelConfig) {
  jestConfig.transform = {
    "^.+\\.js$": here("./babel-transform")
  };
}

module.exports = jestConfig;
//# sourceMappingURL=jest.config.js.map