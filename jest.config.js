// PRIVATE USAGE: To be consumed by this library.
const jestConfig = require("./config").jest;

module.exports = Object.assign(jestConfig, {
  coverageThreshold: null,
});
