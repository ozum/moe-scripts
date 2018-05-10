#!/usr/bin/env node
/// <reference path="../@types/yargs-parser.d.ts" />

import { Project } from "script-helper";

// const project = new Project({ cwd: `${__dirname}/..`, debug: false });
const project: Project = require("./project");
export default project; // If you don't want to use execute() helper, you can access exported project via require.

// If called from directly from CLI
if (require.main === module) {
  try {
    const result = project.executeFromCLISync(); // Optional helper which executes scripts in 'scripts' directory, which is in same directory with this file.
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
