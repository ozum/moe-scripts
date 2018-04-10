const path = require("path");
const { ifAnyDep, hasFile, hasPkgProp, fromRoot } = require("../utils");
const { isTypeScript } = require("../utils-moe");

const here = p => path.join(__dirname, p);

const useBuiltInBabelConfig = !hasFile(".babelrc") && !hasPkgProp("babel");

const ignores = ["/node_modules/", "/fixtures/", "/__tests__/helpers/", "/__test_supplements__/", "/__test_helpers__/", "__mocks__"];

const jestConfig = {
  roots: [fromRoot("src")],
  testEnvironment: ifAnyDep(["webpack", "rollup", "react"], "jsdom", "node"),
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  // collectCoverageFrom: ["src/**/*.+(js|jsx|ts|tsx)"],
  testMatch: ["**/__tests__/**/*.+(js|jsx|ts|tsx)", "**/*.(test|spec).(js|jsx|ts|tsx)"],
  testPathIgnorePatterns: [...ignores],
  // coveragePathIgnorePatterns: [...ignores, "src/(umd|cjs|esm)-entry.js$"],
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$"],
  watchPathIgnorePatterns: [...ignores],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};

if (isTypeScript) {
  jestConfig.transform = { "^.+\\.(js|ts|jsx|tsx)$": "ts-jest" };
  jestConfig.globals = { "ts-jest": { tsConfigFile: "tsconfig-test.json" } };
} else if (useBuiltInBabelConfig) {
  jestConfig.transform = { "^.+\\.js$": here("./babel-transform") };
}

module.exports = jestConfig;
