<!-- DO NOT EDIT README.md (It will be overridden by README.hbs) -->

# moe-scripts

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Description](#description)
- [Synopsis](#synopsis)
- [Beware](#beware)
- [Problem](#problem)
- [Solution](#solution)
- [Configuration](#configuration)
  - [Overriding Configuration](#overriding-configuration)
    - [ESLint](#eslint)
    - [TSLint](#tslint)
    - [Babel](#babel)
    - [Jest](#jest)
- [Inspiration](#inspiration)
- [API](#api)
  - [Modules](#modules)
  - [build](#build)
  - [commit](#commit)
  - [contributors](#contributors)
  - [doc](#doc)
  - [format](#format)
  - [info](#info)
  - [init](#init)
  - [lint](#lint)
  - [precommit](#precommit)
  - [reset](#reset)
  - [test](#test)
  - [travis-after-success](#travis-after-success)
  - [validate](#validate)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Description

CLI toolbox for common scripts for JavaScript / TypeScript projects. Inspired by ["Tools without config"](https://blog.kentcdodds.com/automation-without-config-412ab5e47229)
and [kcd-scripts](https://github.com/kentcdodds/kcd-scripts)

# Synopsis

1. Create a project:
    * `npm init my-project`
    * If TypeScript: add `types` into `package.json` such as:
        * `{ "types": "lib/index" }`
1. Install:
    * `npm install --save-dev moe-scripts`
1. Use scripts:
    * `npm run build -- --watch`
    * `npm run build:doc`
    * `npm run validate`
    * `npm run commit`
    * `npm run release`
    * ... etc.

# Beware

**Build yours using [script-helper](https://www.npmjs.com/package/script-helper).**

Instead of using this toolbox directly, consider creating yours using [script-helper](https://www.npmjs.com/package/script-helper).
This library is an example usage for [script-helper](https://www.npmjs.com/package/script-helper) and not meant for general use.

If it fits you, fork it, because it may change from version to version according to needs of author.

# Problem

There are lots of configuration and boilerplate to start and maintain a JavaScript project.
It is very tiresome to update libraries and configurations within multiple projects.
See ["Tools without config"](https://blog.kentcdodds.com/automation-without-config-412ab5e47229)

# Solution

This toolkit is provided as an npm module and every configuration for linting, testing,
building and more are initialized with a single command and updated simply updating a single npm package.

# Configuration

This toolkit exposes a bin called `moe-scripts`. All scripts are stored in
`lib/scripts` and all configurations are stored either in `lib/config` or in root of the library.

Toolkit decide whether a project is a TypeScript project or JavaScript project by looking `types`
entry in `package.json`.

`moe-scripts init` is automatically executed after package install and creates configuration files
and entries in `package.json` if they do not exist. See [init script below](#module_init).

All scripts can be further refined used arguments related to used tool within that script.
It is mostly avoided to provide extra besides original ones of the tool parameters if really not necessary.

## Overriding Configuration

Most of the configuration can be extended by native extend mechanism of the related
library. Those which cannot be extended such as `.gitignore` or can be extended but
behaves according to location of extended file such as `tsconfig.json` are used with
symbolic links pointing to a file in this toolkit.

All of the configuration can be overridden.

This can be a very helpful way to make editor integration work for tools like
ESLint which require project-based ESLint configuration to be present to work.

### ESLint

Create an `.eslintrc` with the contents of:

```
{"extends": "./node_modules/moe-scripts/eslint.js"}
```

> Note: for now, you'll have to include an `.eslintignore` in your project until
> [this eslint issue is resolved](https://github.com/eslint/eslint/issues/9227).

### TSLint

It is extendible via:

```json
{ "extends": "moe-scripts/tslint.json" }
```

Note: `tslint.json` is not a symbolic link in source root. There is no safe place to link it, because `lib` is not always available in source and `src` is not available in npm package.


### Babel

Or, for `babel`, a `.babelrc` with:

```
{"presets": ["moe-scripts/babel"]}
```

### Jest

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

# Inspiration

This toolkit is based on and very heavily inspired by [kcd-scripts](https://github.com/kentcdodds/kcd-scripts).
I'm also grateful for his [Tools without config](https://blog.kentcdodds.com/automation-without-config-412ab5e47229)
article. I created this as a fork and a separate toolkit instead of contributing it, because he mentioned that, like me,
[kcd-scripts](https://github.com/kentcdodds/kcd-scripts) are a personal project and specific to his needs. (Like this
one is specific to my needs).

# API
## Modules

<dl>
<dt><a href="#module_build">build</a></dt>
<dd><p><p>Build project using TypeScript, Babel or rollup based on project type.</p></p>
<p><p><strong>TypeScript</strong></p></p>
<ul>
<li>Copies js and d.ts files from src to lib using <code>rsync</code>, because <code>tsc</code> does not allow <code>--allowJs</code> and <code>--declaration</code> parameters at the same time.</li>
<li>Cleans target directory before build.</li>
</ul>
<p><strong>Babel</strong></p>
<ul>
<li>If no <code>--ignore</code> parameter presents, ignores by default: <code><strong>tests</strong></code>, <code><strong>mocks</strong></code>, <code><strong>test_supplements</strong></code>, <code><strong>test_helpers</strong></code>, <code>*.(test|spec).(js|ts|jsx|tsx)</code></li>
</ul></dd>
<dt><a href="#module_commit">commit</a></dt>
<dd><p>Starts <a href="https://github.com/commitizen/cz-cli"><code>commitizen</code></a> interactive CLI to commit staged files adhering conventional-changelog using <a href="https://github.com/commitizen/cz-conventional-changelog"><code>cz-conventional-changelog</code></a> plugin.</p></dd>
<dt><a href="#module_contributors">contributors</a></dt>
<dd><p>WIP</p></dd>
<dt><a href="#module_doc">doc</a></dt>
<dd><p><p>Generates documentation.</p></p>
<ul>
<li>Creates or updates <code>README.md</code> file from <code>README.hbs</code> <a href="https://handlebarsjs.com/">handlebars</a> template file and
<a href="http://usejsdoc.org/">JSDoc</a> comments in source files.</li>
<li>Generates table of contents.</li>
<li>If no <code>--configure</code> parameter is present and no configuration file is available, uses builtin configuration provided by this library.</li>
<li>If no <code>--files</code> parameter given, uses all files recursively in <code>src</code> directory.</li>
<li>If no <code>--template</code> parameter given, uses README.hbs` in project root.</li>
</ul></dd>
<dt><a href="#module_format">format</a></dt>
<dd><p><p>Formats project using <code>prettier</code>.</p></p>
<ul>
<li>If no config provided (<code>--config</code>, <code>prettier.config.js</code> or <code>prettierrc</code> in <code>package.json</code>) uses builtin configuration provided by this library.</li>
<li>If no <code>--ignore-path</code> parameter provided or no <code>.prettierignore</code> file is present uses builtin ignore file provided by this library.</li>
</ul></dd>
<dt><a href="#module_info">info</a></dt>
<dd><p>Displays information about project and this module.</p></dd>
<dt><a href="#module_init">init</a></dt>
<dd><p><p>Initializes project</p></p>
<p><p><code>init</code> script generates necessary files and updates <code>package.json</code>. This script executed automatically during install at <code>preinstall</code> and <code>postinstall</code> stages.
Also can be manually executed. In addition modification can be reversed using <code>reset</code> script.</p></p>
<p><p>Adds necessary entries in <code>package.json</code> and creates files.</p></p>
<p><p><strong>Entries in <code>package.json</code></strong></p></p>
<table>
<thead>
<tr>
<th>Entry</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>main</td>
<td>Primary entry point to your program</td>
</tr>
<tr>
<td>files</td>
<td>Files to publish in npm package</td>
</tr>
<tr>
<td>scripts.file</td>
<td>Watch and execute a file when it changes</td>
</tr>
<tr>
<td>scripts.watch</td>
<td>Watch amd build project when files change</td>
</tr>
<tr>
<td>scripts.build</td>
<td>Build project</td>
</tr>
<tr>
<td>scripts.build:doc</td>
<td>Build README.md from handlebars template and JSDoc comments</td>
</tr>
<tr>
<td>scripts.test</td>
<td>Test project using <a href="https://facebook.github.io/jest/">Jest</a></td>
</tr>
<tr>
<td>scripts.test:update</td>
<td>Test project using <a href="https://facebook.github.io/jest/">Jest</a> and updating snapshots</td>
</tr>
<tr>
<td>scripts.lint</td>
<td>Lint project</td>
</tr>
<tr>
<td>scripts.format</td>
<td>Format project</td>
</tr>
<tr>
<td>scripts.validate</td>
<td>Execute validation scripts</td>
</tr>
<tr>
<td>scripts.commit</td>
<td>Commit project</td>
</tr>
<tr>
<td>scripts.prepublishOnly</td>
<td>Build project before publishing to npm</td>
</tr>
<tr>
<td>scripts.squash</td>
<td>Sqush and merge project branch</td>
</tr>
<tr>
<td>scripts.release</td>
<td>Publish project to git and npm repo</td>
</tr>
</tbody>
</table>
<p><strong>Files</strong></p>
<table>
<thead>
<tr>
<th>File</th>
<th>Track</th>
<th>Link</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>.git/hooks</td>
<td></td>
<td></td>
<td><strong>(Only during preinstall)</strong> githooks directory</td>
</tr>
<tr>
<td>.env</td>
<td>✓</td>
<td></td>
<td>Environment variables to read from using <a href="https://www.npmjs.com/package/dotenv">dotenv</a> (also included)</td>
</tr>
<tr>
<td>.env.sample</td>
<td>✓</td>
<td></td>
<td>Sample file for .env</td>
</tr>
<tr>
<td>.npmignore</td>
<td>✓</td>
<td>✓</td>
<td>Npm ignore file provided by this library</td>
</tr>
<tr>
<td>.gitignore</td>
<td>✓</td>
<td>✓</td>
<td>Git ignore file provided by this library</td>
</tr>
<tr>
<td>.gitattributes</td>
<td>✓</td>
<td>✓</td>
<td>Gitattributes file provided by this library</td>
</tr>
<tr>
<td>CHANGELOG.md</td>
<td></td>
<td></td>
<td>A base change log file</td>
</tr>
<tr>
<td>.editorconfig</td>
<td>✓</td>
<td></td>
<td>Editor configruation file</td>
</tr>
<tr>
<td>LICENSE</td>
<td>✓</td>
<td></td>
<td>License file based on license type in <code>package.json</code></td>
</tr>
<tr>
<td>README.hbs</td>
<td>✓</td>
<td></td>
<td>Readme template in <a href="https://handlebarsjs.com/">handlebars</a> format</td>
</tr>
<tr>
<td>.prettierrc.js</td>
<td>✓</td>
<td></td>
<td>Prettier configuration file</td>
</tr>
<tr>
<td>.prettierignore</td>
<td>✓</td>
<td>✓</td>
<td>Ignore file for prettier</td>
</tr>
<tr>
<td>.huskyrc.js</td>
<td>✓</td>
<td></td>
<td><a href="https://github.com/typicode/husky">husky</a> Configuration file to manage git hooks from npm scripts</td>
</tr>
<tr>
<td>commitlint.config.js</td>
<td>✓</td>
<td></td>
<td><a href="https://github.com/marionebl/commitlint">commitlint</a> Configuration file to lint commit messages</td>
</tr>
<tr>
<td>tslint.json</td>
<td>✓</td>
<td></td>
<td><img src="https://img.shields.io/badge/-TS-2C4E7E.svg" alt="TS"> TSLint configuration file</td>
</tr>
<tr>
<td>.eslintrc</td>
<td>✓</td>
<td></td>
<td><img src="https://img.shields.io/badge/-ES-F6DC50.svg" alt="ESLint"> ESLint configuration file</td>
</tr>
<tr>
<td>tsconfig.json</td>
<td>✓</td>
<td></td>
<td><img src="https://img.shields.io/badge/-TS-2C4E7E.svg" alt="TS"> TypeScript configuration file. (Not created as link, for IDEs</td>
</tr>
<tr>
<td>tsconfig-test.json</td>
<td>✓</td>
<td>✓</td>
<td><img src="https://img.shields.io/badge/-TS-2C4E7E.svg" alt="TS"> TypeScript configuration file used during testing</td>
</tr>
</tbody>
</table></dd>
<dt><a href="#module_lint">lint</a></dt>
<dd><p><p>Lints project using TSLint or ESLint</p></p>
<p><p><strong>TSLint</strong></p></p>
<ul>
<li>If project has no <code>tslint.json</code> or no <code>--config</code> is given, uses builtin configuration provided by this library.</li>
<li>If no files and <code>--project</code> argument given, uses default TypeScript project (<code>tsconfig.json</code> located in the root of project).</li>
</ul>
<p><strong>ESLint</strong></p>
<ul>
<li>If project has no ESLint configuration (<code>.eslintrc.js</code> or <code>eslintConfig</code> in <code>package.json</code> etc.) or no <code>--config</code> is given,
uses builtin configuration provided by this library.</li>
<li>If no <code>--ignore-path</code> argument is given uses <code>.gitignore</code>.</li>
<li>Uses <code>--cache</code> by default. (Can be disabled by <code>--no-cache</code>).</li>
</ul></dd>
<dt><a href="#module_precommit">precommit</a></dt>
<dd><p><p>Script to be executed automatically just before commit. Utilizes <a href="https://github.com/okonet/lint-staged">lint-staged</a></p></p>
<p><p>This script is defined in <code>.huskyrc.js</code> as required. It is used by <code>husky</code> and contains <code>lint-staged</code> config.</p></p>
<ul>
<li>If no config provided (<code>--config</code>, <code>lint-staged.config.js</code> or <code>lint-staged</code> in <code>package.json</code>) uses builtin configuration provided by this library.</li>
<li>Builds README.md and adds it to git</li>
<li>Executes <code>lint-staged</code>.<ul>
<li>format (If not opted out) and add to git</li>
<li>lint</li>
<li>test (executes test related to changed files)</li>
</ul>
</li>
<li>If opted in, executes validation script.</li>
</ul></dd>
<dt><a href="#module_reset">reset</a></dt>
<dd><p>Reverses modifications made by this library. (Please note that deleted files are not reversed. You should recover them from git repo)</p></dd>
<dt><a href="#module_test">test</a></dt>
<dd><p><p>Test project using <a href="https://facebook.github.io/jest/">Jest</a></p></p>
<ul>
<li>Sets <code>BABEL_ENV</code> and <code>NODE_ENV</code> to <code>test</code>.</li>
<li>If not in CI, precommit stage, or following arguments are not present <code>--no-watch</code>, <code>--coverage</code>, <code>--updateSnapshot</code> or <code>--watchAll</code>, watches changes.</li>
<li>If no config provided (<code>--config</code>, <code>jest.config.js</code> etc.) uses builtin configuration provided by this library.</li>
</ul></dd>
<dt><a href="#module_travis-after-success">travis-after-success</a></dt>
<dd><p>WIP</p></dd>
<dt><a href="#module_validate">validate</a></dt>
<dd><p>Validates project.</p>
<p>Executes following tasks based on the event being in:</p>
<table>
<thead>
<tr>
<th>Event</th>
<th>Tasks</th>
</tr>
</thead>
<tbody>
<tr>
<td>precommit</td>
<td><code>lint</code>, <code>test</code>, <code>flow</code> or <code>typescript</code>, <code>nsp</code></td>
</tr>
<tr>
<td>other</td>
<td><code>flow</code> or <code>typescript</code>, <code>nsp</code></td>
</tr>
</tbody>
</table>
<p>To avoid redundant execution, <code>lint</code> and <code>test</code> are not executed in precommit stage because those are executed in <code>precommit</code> script
already.</p></dd>
</dl>

<a name="module_build"></a>

## build
<p>Build project using TypeScript, Babel or rollup based on project type.</p>
<p><strong>TypeScript</strong></p>
<ul>
<li>Copies js and d.ts files from src to lib using <code>rsync</code>, because <code>tsc</code> does not allow <code>--allowJs</code> and <code>--declaration</code> parameters at the same time.</li>
<li>Cleans target directory before build.</li>
</ul>
<p><strong>Babel</strong></p>
<ul>
<li>If no <code>--ignore</code> parameter presents, ignores by default: <code>__tests__</code>, <code>__mocks__</code>, <code>__test_supplements__</code>, <code>__test_helpers__</code>, <code>*.(test|spec).(js|ts|jsx|tsx)</code></li>
</ul>

**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [--bundle] |  |  | <p>If present, uses rollup, otherwise TypeScript or Babel.</p> |
| [--outDir] | <code>string</code> | <code>&quot;lib&quot;</code> | <p><img src="https://img.shields.io/badge/-TS-2C4E7E.svg" alt="TS"> Output destination for built files.</p> |
| [--no-clean] |  |  | <p><img src="https://img.shields.io/badge/-TS-2C4E7E.svg" alt="TS"> If present, does not clean target directory.</p> |
| [--out-dir] | <code>string</code> | <code>&quot;lib&quot;</code> | <p><img src="https://img.shields.io/badge/-Babel-F3DA62.svg" alt="Babel"> Output destination for built files.</p> |
| [OTHERS] |  |  | <p>All CLI options used by related binary. (tsc, babel or rollup)</p> |

**Example**  
```js
$ npm run build -- --watch --preserveWatchOutput
$ npx moe-scripts build
$ npx moe-scripts build --watch --preserveWatchOutput
```
<a name="module_commit"></a>

## commit
<p>Starts <a href="https://github.com/commitizen/cz-cli"><code>commitizen</code></a> interactive CLI to commit staged files adhering conventional-changelog using <a href="https://github.com/commitizen/cz-conventional-changelog"><code>cz-conventional-changelog</code></a> plugin.</p>

**Example**  
```js
$ npm run commit
$ npx moe-scripts commit
```
<a name="module_contributors"></a>

## contributors
<p>WIP</p>

**Example**  
```js
$ npx moe-scripts contributors
```
<a name="module_doc"></a>

## doc
<p>Generates documentation.</p>
<ul>
<li>Creates or updates <code>README.md</code> file from <code>README.hbs</code> <a href="https://handlebarsjs.com/">handlebars</a> template file and
<a href="http://usejsdoc.org/">JSDoc</a> comments in source files.</li>
<li>Generates table of contents.</li>
<li>If no <code>--configure</code> parameter is present and no configuration file is available, uses builtin configuration provided by this library.</li>
<li>If no <code>--files</code> parameter given, uses all files recursively in <code>src</code> directory.</li>
<li>If no <code>--template</code> parameter given, uses README.hbs` in project root.</li>
</ul>

**Properties**

| Name | Description |
| --- | --- |
| [OTHERS] | <p>All CLI options used by related binary. (<code>jsdoc2md</code>)</p> |

**Example**  
```js
$ npm run build:doc
$ npx moe-scripts doc
```
<a name="module_format"></a>

## format
<p>Formats project using <code>prettier</code>.</p>
<ul>
<li>If no config provided (<code>--config</code>, <code>prettier.config.js</code> or <code>prettierrc</code> in <code>package.json</code>) uses builtin configuration provided by this library.</li>
<li>If no <code>--ignore-path</code> parameter provided or no <code>.prettierignore</code> file is present uses builtin ignore file provided by this library.</li>
</ul>

**Properties**

| Name | Description |
| --- | --- |
| [--no-write] | <p>If provided files are not written to disk. (Default is write to disk).</p> |
| [OTHERS] | <p>All CLI options used by related binary. (<code>prettier</code>)</p> |

**Example**  
```js
$ npm run format
$ npx moe-scripts format
```
<a name="module_info"></a>

## info
<p>Displays information about project and this module.</p>

**Example**  
```js
$ npx moe-scripts info
```
<a name="module_init"></a>

## init
<p>Initializes project</p>
<p><code>init</code> script generates necessary files and updates <code>package.json</code>. This script executed automatically during install at <code>preinstall</code> and <code>postinstall</code> stages.
Also can be manually executed. In addition modification can be reversed using <code>reset</code> script.</p>
<p>Adds necessary entries in <code>package.json</code> and creates files.</p>
<p><strong>Entries in <code>package.json</code></strong></p>
<table>
<thead>
<tr>
<th>Entry</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>main</td>
<td>Primary entry point to your program</td>
</tr>
<tr>
<td>files</td>
<td>Files to publish in npm package</td>
</tr>
<tr>
<td>scripts.file</td>
<td>Watch and execute a file when it changes</td>
</tr>
<tr>
<td>scripts.watch</td>
<td>Watch amd build project when files change</td>
</tr>
<tr>
<td>scripts.build</td>
<td>Build project</td>
</tr>
<tr>
<td>scripts.build:doc</td>
<td>Build README.md from handlebars template and JSDoc comments</td>
</tr>
<tr>
<td>scripts.test</td>
<td>Test project using <a href="https://facebook.github.io/jest/">Jest</a></td>
</tr>
<tr>
<td>scripts.test:update</td>
<td>Test project using <a href="https://facebook.github.io/jest/">Jest</a> and updating snapshots</td>
</tr>
<tr>
<td>scripts.lint</td>
<td>Lint project</td>
</tr>
<tr>
<td>scripts.format</td>
<td>Format project</td>
</tr>
<tr>
<td>scripts.validate</td>
<td>Execute validation scripts</td>
</tr>
<tr>
<td>scripts.commit</td>
<td>Commit project</td>
</tr>
<tr>
<td>scripts.prepublishOnly</td>
<td>Build project before publishing to npm</td>
</tr>
<tr>
<td>scripts.squash</td>
<td>Sqush and merge project branch</td>
</tr>
<tr>
<td>scripts.release</td>
<td>Publish project to git and npm repo</td>
</tr>
</tbody>
</table>
<p><strong>Files</strong></p>
<table>
<thead>
<tr>
<th>File</th>
<th>Track</th>
<th>Link</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>.git/hooks</td>
<td></td>
<td></td>
<td><strong>(Only during preinstall)</strong> githooks directory</td>
</tr>
<tr>
<td>.env</td>
<td>✓</td>
<td></td>
<td>Environment variables to read from using <a href="https://www.npmjs.com/package/dotenv">dotenv</a> (also included)</td>
</tr>
<tr>
<td>.env.sample</td>
<td>✓</td>
<td></td>
<td>Sample file for .env</td>
</tr>
<tr>
<td>.npmignore</td>
<td>✓</td>
<td>✓</td>
<td>Npm ignore file provided by this library</td>
</tr>
<tr>
<td>.gitignore</td>
<td>✓</td>
<td>✓</td>
<td>Git ignore file provided by this library</td>
</tr>
<tr>
<td>.gitattributes</td>
<td>✓</td>
<td>✓</td>
<td>Gitattributes file provided by this library</td>
</tr>
<tr>
<td>CHANGELOG.md</td>
<td></td>
<td></td>
<td>A base change log file</td>
</tr>
<tr>
<td>.editorconfig</td>
<td>✓</td>
<td></td>
<td>Editor configruation file</td>
</tr>
<tr>
<td>LICENSE</td>
<td>✓</td>
<td></td>
<td>License file based on license type in <code>package.json</code></td>
</tr>
<tr>
<td>README.hbs</td>
<td>✓</td>
<td></td>
<td>Readme template in <a href="https://handlebarsjs.com/">handlebars</a> format</td>
</tr>
<tr>
<td>.prettierrc.js</td>
<td>✓</td>
<td></td>
<td>Prettier configuration file</td>
</tr>
<tr>
<td>.prettierignore</td>
<td>✓</td>
<td>✓</td>
<td>Ignore file for prettier</td>
</tr>
<tr>
<td>.huskyrc.js</td>
<td>✓</td>
<td></td>
<td><a href="https://github.com/typicode/husky">husky</a> Configuration file to manage git hooks from npm scripts</td>
</tr>
<tr>
<td>commitlint.config.js</td>
<td>✓</td>
<td></td>
<td><a href="https://github.com/marionebl/commitlint">commitlint</a> Configuration file to lint commit messages</td>
</tr>
<tr>
<td>tslint.json</td>
<td>✓</td>
<td></td>
<td><img src="https://img.shields.io/badge/-TS-2C4E7E.svg" alt="TS"> TSLint configuration file</td>
</tr>
<tr>
<td>.eslintrc</td>
<td>✓</td>
<td></td>
<td><img src="https://img.shields.io/badge/-ES-F6DC50.svg" alt="ESLint"> ESLint configuration file</td>
</tr>
<tr>
<td>tsconfig.json</td>
<td>✓</td>
<td></td>
<td><img src="https://img.shields.io/badge/-TS-2C4E7E.svg" alt="TS"> TypeScript configuration file. (Not created as link, for IDEs</td>
</tr>
<tr>
<td>tsconfig-test.json</td>
<td>✓</td>
<td>✓</td>
<td><img src="https://img.shields.io/badge/-TS-2C4E7E.svg" alt="TS"> TypeScript configuration file used during testing</td>
</tr>
</tbody>
</table>

**Properties**

| Name | Description |
| --- | --- |
| [...files] | <p>Files to lint</p> |
| [--no-cache] | <p><img src="https://img.shields.io/badge/-ESLint-4941D0.svg" alt="ESLint"> Disables ESLint <code>--cache</code> arg which is added by this script.</p> |
| [OTHERS] | <p>All CLI options used by related binary. (TSLint or ESLint)</p> |

**Example**  
```js
$ npx moe-scripts init
```
<a name="module_lint"></a>

## lint
<p>Lints project using TSLint or ESLint</p>
<p><strong>TSLint</strong></p>
<ul>
<li>If project has no <code>tslint.json</code> or no <code>--config</code> is given, uses builtin configuration provided by this library.</li>
<li>If no files and <code>--project</code> argument given, uses default TypeScript project (<code>tsconfig.json</code> located in the root of project).</li>
</ul>
<p><strong>ESLint</strong></p>
<ul>
<li>If project has no ESLint configuration (<code>.eslintrc.js</code> or <code>eslintConfig</code> in <code>package.json</code> etc.) or no <code>--config</code> is given,
uses builtin configuration provided by this library.</li>
<li>If no <code>--ignore-path</code> argument is given uses <code>.gitignore</code>.</li>
<li>Uses <code>--cache</code> by default. (Can be disabled by <code>--no-cache</code>).</li>
</ul>

**Properties**

| Name | Description |
| --- | --- |
| [...files] | <p>Files to lint</p> |
| [--no-cache] | <p><img src="https://img.shields.io/badge/-ESLint-4941D0.svg" alt="ESLint"> Disables ESLint's <code>--cache</code> arg which is added by this script.</p> |
| [OTHERS] | <p>All CLI options used by related binary. (TSLint or ESLint)</p> |

**Example**  
```js
$ npm run lint
$ npm run lint my-file.ts -- --config my-config.json
$ npx moe-scripts lint
$ npx moe-scripts lint --no-cache
$ npx moe-scripts lint my-file.ts
```
<a name="module_precommit"></a>

## precommit
<p>Script to be executed automatically just before commit. Utilizes <a href="https://github.com/okonet/lint-staged">lint-staged</a></p>
<p>This script is defined in <code>.huskyrc.js</code> as required. It is used by <code>husky</code> and contains <code>lint-staged</code> config.</p>
<ul>
<li>If no config provided (<code>--config</code>, <code>lint-staged.config.js</code> or <code>lint-staged</code> in <code>package.json</code>) uses builtin configuration provided by this library.</li>
<li>Builds README.md and adds it to git</li>
<li>Executes <code>lint-staged</code>.<ul>
<li>format (If not opted out) and add to git</li>
<li>lint</li>
<li>test (executes test related to changed files)</li>
</ul>
</li>
<li>If opted in, executes validation script.</li>
</ul>

**Properties**

| Name | Description |
| --- | --- |
| [OTHERS] | <p>All CLI options used by related binary. (<code>prettier</code>)</p> |

<a name="module_reset"></a>

## reset
<p>Reverses modifications made by this library. (Please note that deleted files are not reversed. You should recover them from git repo)</p>

**Example**  
```js
$ npx moe-scripts reset
```
<a name="module_test"></a>

## test
<p>Test project using <a href="https://facebook.github.io/jest/">Jest</a></p>
<ul>
<li>Sets <code>BABEL_ENV</code> and <code>NODE_ENV</code> to <code>test</code>.</li>
<li>If not in CI, precommit stage, or following arguments are not present <code>--no-watch</code>, <code>--coverage</code>, <code>--updateSnapshot</code> or <code>--watchAll</code>, watches changes.</li>
<li>If no config provided (<code>--config</code>, <code>jest.config.js</code> etc.) uses builtin configuration provided by this library.</li>
</ul>

**Properties**

| Name | Description |
| --- | --- |
| [--no-watch] | <p>If provided, works once. (Default is watch mode)</p> |
| [OTHERS] | <p>All CLI options used by related binary. (<code>jest</code>)</p> |

**Example**  
```js
$ npm run test
$ npx moe-scripts test
```
<a name="module_travis-after-success"></a>

## travis-after-success
<p>WIP</p>

**Example**  
```js
$ npx travis-after-success
```
<a name="module_validate"></a>

## validate
<p>Validates project.</p>
<p>Executes following tasks based on the event being in:</p>
<table>
<thead>
<tr>
<th>Event</th>
<th>Tasks</th>
</tr>
</thead>
<tbody>
<tr>
<td>precommit</td>
<td><code>lint</code>, <code>test</code>, <code>flow</code> or <code>typescript</code>, <code>nsp</code></td>
</tr>
<tr>
<td>other</td>
<td><code>flow</code> or <code>typescript</code>, <code>nsp</code></td>
</tr>
</tbody>
</table>
<p>To avoid redundant execution, <code>lint</code> and <code>test</code> are not executed in precommit stage because those are executed in <code>precommit</code> script
already.</p>

**Properties**

| Name | Description |
| --- | --- |
| [0] | <p>If provided vomma separated list of npm script names to run.</p> |

**Example**  
```js
$ npm run validate my-custom-validator
$ npx moe-scripts validate
$ npx moe-scripts validate my-custom-validator,second-validator
```
