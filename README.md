# moe-scripts

Toolbox for common scripts for node.js projects

## Beware

This project is not meant for general use, so copy and use if it fits. It may change from
version to version according to needs of author.

## Problem

There are lots of configuration and boilerplate to start and maintain a JavaScript project. It
is very tiresome to update libraries and configurations within multiple projects.

## Solution

This toolkit is provided as an npm module and every configuration for linting, testing, building and more
are initialized with a single command and updated simply updating a single npm package.

## Installation

```
npm install --save-dev moe-scripts
```

## Usage

This toolkit exposes a bin called `moe-scripts`. All scripts are stored in
`src/scripts` and all configurations are stored either in `src/config` or in root.

### Overriding Config

Most of the configuration can be extended by native extend mechanism of the related
library. Those which cannot be extended such as `.gitignore` or can be extended but
behaves according to location of extended file such as `tsconfig.json` are used with
symbolic links pointing to a file in this toolkit.

All of the configuration can be overridden.

This can be a very helpful way to make editor integration work for tools like
ESLint which require project-based ESLint configuration to be present to work.

So, if we were to do this for ESLint, you could create an `.eslintrc` with the
contents of:

```
{"extends": "./node_modules/moe-scripts/eslint.js"}
```

> Note: for now, you'll have to include an `.eslintignore` in your project until
> [this eslint issue is resolved](https://github.com/eslint/eslint/issues/9227).

Or, for `babel`, a `.babelrc` with:

```
{"presets": ["moe-scripts/babel"]}
```

Or, for `jest`:

```js
const {jest: jestConfig} = require('moe-scripts/config')
module.exports = Object.assign(jestConfig, {
  // your overrides here

  // for test written in Typescript, add:
  transform: {
    '\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
})
```

## Configuration

Toolkit decide whether a project is a TypeScript project or JavaScript project by looking `types`
entry in `package.json`. 

`moe-scripts init` automatically executed after package install and creates configuration files
if they do not exist and script entries in `package.json` as below:

All scripts can be further refined used arguments related to used tool within that script.
It is avoided to provide extra besides original ones of the tool parameters if really not necessary.

|name|script|description
|---|---|---|
|build|moe-scripts build|Builds ES (Babel) or TypeScript project.|
|build:doc|moe-scripts doc --no-cache|Builds `README.md` using `jsdoc2md` and `doctoc`|
|test|moe-scripts test|Tests project|
|test:update|moe-scripts test --updateSnapshot|Tests and updates snapshots|
|lint|moe-scripts lint|Lints project|
|format|moe-scripts format|Formats project source code|
|validate|moe-scripts validate|Test, lint, type check, security check code|
|postversion|git push && git push --tags && npm publish|Pushes project to its repo|
|prepublishOnly|npm run build|Build project before publishing to registry|

`moe-scripts precommit` script is defined in `.huskyrc.js` as required. It is used by `husky` and
contains `lint-staged` config.

## Inspiration

This toolkit is based on and very heavily inspired by [kcd-scripts](https://github.com/kentcdodds/kcd-scripts).
I'm aldo grateful for his [Tools without config](https://blog.kentcdodds.com/automation-without-config-412ab5e47229)
article. I created this as a separate toolkit instead of contributing it, because he mentioned that, like me,
[kcd-scripts](https://github.com/kentcdodds/kcd-scripts) are a personal project and has no intentions of
documenting it as of this writing.

## LICENSE

MIT

