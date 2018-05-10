#!/usr/bin/env node

// Commitizen for multi-repo projects. See: https://github.com/commitizen/cz-cli
const path = require("path");
const { bootstrap } = require("commitizen/dist/cli/git-cz");
const project = require("../project");

bootstrap({
  cliPath: project.fromRoot("node_modules/commitizen"), // path.join(__dirname, "../../../../commitizen"), // It is different for thi module itself and projects.
  config: {
    path: "cz-conventional-changelog",
  },
});
