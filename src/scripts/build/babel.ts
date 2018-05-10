import { Project, replaceArgumentName, Script, ScriptKit } from "script-helper";
import * as path from "path";
import fs from "fs-extra";

const script: Script = function script(project: Project, rawArgs: Array<any>, s: ScriptKit) {
  const args = replaceArgumentName(rawArgs, "--outDir", "--out-dir"); // Replace --outDir with --out-dir parameter as requested by babel.
  const useBuiltinConfig = !args.includes("--presets") && !project.hasFileSync(".babelrc") && !project.package.has("babel");
  const config = useBuiltinConfig ? ["--presets", project.fromConfigDir(`config/babelrc.${s.extension}`)] : [];

  const ignore = args.includes("--ignore")
    ? []
    : ["--ignore", "**/__tests__,**/__mocks__,**/__test_supplements__,**/__test_helpers__,**/*.(test|spec).(js|ts|jsx|tsx)"];

  const useSpecifiedOutDir = args.includes("--out-dir");
  const outDir = useSpecifiedOutDir ? [] : ["--out-dir", "lib"];

  if (!useSpecifiedOutDir && !args.includes("--no-clean")) {
    fs.removeSync(project.fromRoot(outDir[1]));
  }

  return project.executeSync(["babel", [...outDir, ...ignore, ...config, "src"].concat(args)]);
};

export { script };
