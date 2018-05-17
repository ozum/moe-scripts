const fs = require("fs-extra");
const path = require("path");

const config = fs.existsSync(path.join(__dirname, "src")) ? require("./src/config") : require("./lib/config");

console.log(config);
module.exports = config;
