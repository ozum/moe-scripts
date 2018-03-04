var babelJest = require("babel-jest");

module.exports = babelJest.createTransformer({
  presets: [require.resolve("./babelrc")]
});
//# sourceMappingURL=babel-transform.js.map