var spawn = require('cross-spawn');

var _require = require('../utils'),
    resolveBin = _require.resolveBin;

var args = process.argv.slice(2);
var result = spawn.sync(resolveBin('all-contributors-cli', {
  executable: 'all-contributors'
}), args, {
  stdio: 'inherit'
});
process.exit(result.status);
//# sourceMappingURL=contributors.js.map