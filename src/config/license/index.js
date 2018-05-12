const fs = require("fs-extra");
const path = require("path");
const project = require("../../project");

function getLicense(licenseName, fullName, year = new Date().getFullYear()) {
  let licenseFile = path.join(__dirname, licenseName);

  if (!fs.existsSync(licenseFile)) {
    licenseFile = path.join(__dirname, "license");
    project.logger.warn(`License type in package.json "${licenseName}" cannot be found, used generic license insted.`);
  }

  const text = fs.readFileSync(licenseFile, "utf8");
  return text.replace("[year]", year).replace("[fullname]", fullName);
}

module.exports = getLicense;
