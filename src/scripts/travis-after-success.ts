import { Project, Script, ScriptKit } from "script-helper";
import path from "path";

const script: Script = function script(project: Project, args: Array<any>, s: ScriptKit) {
  const autorelease =
    project.package.get("version") === "0.0.0-semantically-released" &&
    project.parseEnv("TRAVIS", false) &&
    process.env.TRAVIS_BRANCH === "master" &&
    !project.parseEnv("TRAVIS_PULL_REQUEST", false);

  const reportCoverage = project.hasFileSync("coverage") && !project.parseEnv("SKIP_CODECOV", false);

  if (!autorelease && !reportCoverage) {
    project.logger.info("No need to autorelease or report coverage. Skipping travis-after-success script...");
    return { status: 0 };
  }

  return project.executeSync({
    codecov: reportCoverage ? `echo installing codecov && npx -p codecov -c 'echo running codecov && codecov'` : null,
    release: autorelease
      ? `echo installing semantic-release && npx -p semantic-release@15 -c 'echo running semantic-release && semantic-release pre && npm publish && semantic-release post'`
      : null,
  });
};

export { script };
