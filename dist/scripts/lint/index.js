var _require = require('../../utils-moe'),
    isTypeScript = _require.isTypeScript;

var linter = isTypeScript ? './tslint' : './eslint';

require(linter);
//# sourceMappingURL=index.js.map