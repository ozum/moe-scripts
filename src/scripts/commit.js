const path = require('path');
const { bootstrap } = require('commitizen/dist/cli/git-cz');

console.log('PATH: ' + path.join(__dirname, '../../node_modules/commitizen'));

bootstrap({
  cliPath: path.join(__dirname, '../../node_modules/commitizen'),
  config: {
    "path": "cz-conventional-changelog"
  }
});