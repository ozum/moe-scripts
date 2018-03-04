module.exports = {
  babel: require('./babelrc'),
  eslint: require('./eslintrc'),
  jest: require('./jest.config'),
  lintStaged: require('./lintstagedrc'),
  prettier: require('./prettierrc'),
  getRollupConfig: function getRollupConfig() {
    return require('./rollup.config');
  }
};
//# sourceMappingURL=index.js.map