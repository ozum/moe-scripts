// Exclude prettier: cascaded exports causes IDE fail.
const babel = require("./babelrc");
const eslint = require("./eslintrc");
const jest = require("./jest.config");
const lintStaged = require("./lintstagedrc");
const getRollupConfig = require("./rollup.config");
const commitlintConfig = require("./commitlint.config");
const husky = require("./husky");

module.exports = { babel, eslint, jest, lintStaged, getRollupConfig, commitlintConfig, husky };
