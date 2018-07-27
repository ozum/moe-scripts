const path = require("path");
const project = require("../project");

const here = p => path.join(__dirname, p);

const useBuiltInBabelConfig = !project.hasFileSync(".babelrc") && !project.package.has("babel");

const ignores = ["/node_modules/", "/fixtures/", "/__tests__/helpers/", "/__test_supplements__/", "/__test_helpers__/", "__mocks__"];

const jestConfig = {
  roots: [project.hasFileSync("src", project.fromRoot("src"), project.fromRoot("lib"))],
  testEnvironment: project.hasAnyDep(["webpack", "rollup", "react"], "jsdom", "node"),
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: ["src/**/*.+(js|jsx|ts|tsx)"],
  testMatch: ["**/__tests__/**/*.+(js|jsx|ts|tsx)", "**/*.(test|spec).(js|jsx|ts|tsx)"],
  testPathIgnorePatterns: [...ignores],
  coveragePathIgnorePatterns: [...ignores, "src/(umd|cjs|esm)-entry.js$", "/src/bin/"], // Exclude CLI files located in bin, because cli cannot be instrumented by JEST as of 22
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

if (project.isTypeScript) {
  jestConfig.transform = { "^.+\\.(js|ts|jsx|tsx)$": "ts-jest" };
  jestConfig.globals = { "ts-jest": { tsConfigFile: "tsconfig-test.json" } };
} else if (useBuiltInBabelConfig) {
  jestConfig.transform = { "^.+\\.js$": here("./babel-transform") };
}

module.exports = jestConfig;
