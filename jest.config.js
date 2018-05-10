// PRIVATE USAGE: To bonsumed by this library.
const { jest: jestConfig } = require("./config").jest;

module.exports = Object.assign(jestConfig, {
  coverageThreshold: null,
});
