const fs = require("fs-extra");
const path = require("path");

module.exports = fs.existsSync(path.join(__dirname, "src")) ? require("./src/config/prettierrc") : require("./lib/config/prettierrc");
