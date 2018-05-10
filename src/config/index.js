const babel = require("./babelrc");
const eslint = require("./eslintrc");
const jest = require("./jest.config");
const lintStaged = require("./lintstagedrc");
const prettier = require("./prettierrc");
const getRollupConfig = require("./rollup.config");
const commitlintConfig = require("./commitlint.config");
const husky = require("./husky");

module.exports = { babel, eslint, jest, lintStaged, prettier, getRollupConfig, commitlintConfig, husky };
