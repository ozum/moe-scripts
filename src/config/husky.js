const project = require("../project");

module.exports = {
  hooks: {
    "pre-commit": `${project.moduleBin} precommit`,
    "commit-msg": "commitlint -e $GIT_PARAMS",
  },
};
