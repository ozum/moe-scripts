module.exports = {
  "hooks": {
    "pre-commit": "moe-scripts precommit",
    "commit-msg": "commitlint -e $GIT_PARAMS",
  }
};
