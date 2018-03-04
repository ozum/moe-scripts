const { isTypeScript } = require('../../utils-moe');

const linter = isTypeScript ? './tslint' : './eslint';

require(linter);