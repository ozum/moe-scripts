const {ifAnyDep} = require('../utils')

module.exports = {
  extends: [
    ifAnyDep('react', 'eslint-config-airbnb', 'eslint-config-airbnb-base'),
    'plugin:security/recommended',
    'plugin:jest/recommended',
    'prettier',
    ifAnyDep('react', 'prettier/react'),
  ].filter(Boolean),
  plugins: ['security', 'jest'],
  "env": {
    "jest/globals": true,
  },
  "rules": {
    "no-cond-assign":    ["error", "except-parens"],
    "linebreak-style":   ["error", "unix"],
    "no-multi-spaces":   ["off", { "exceptions": { "Property": true, "VariableDeclarator": true, "ImportDeclaration": true } } ],
    "require-jsdoc":     ["error", { "require": { "FunctionDeclaration": true, "MethodDefinition": true, "ClassDeclaration": true } }],
    "valid-jsdoc":       ["error"],
    "max-len":           ["off"],
    "new-cap":           ["error", { "capIsNewExceptions": ["List", "Map", "Set"] }]
  }
}
