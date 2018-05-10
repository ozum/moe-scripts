import { Project, replaceArgumentName, Executable, Script, ScriptKit } from "script-helper";
import fs from "fs-extra";

const script: Script = function script(project: Project, rawArgs: Array<any>, s: ScriptKit) {
  const args = replaceArgumentName(rawArgs, "--out-dir", "--outDir"); // Replace --out-dir parameter as requested by tsc.
  const useSpecifiedOutDir = args.includes("--outDir");
  const outDir = useSpecifiedOutDir ? [] : ["--outDir", "lib"];
  const willWatch = args.includes("--watch");

  if (!useSpecifiedOutDir && !args.includes("--no-clean")) {
    fs.removeSync(project.fromRoot(outDir[1]));
  }

  const fileExtRx = "/(^.?|.[^d]|[^.]d|[^.][^d]).ts$/"; // Matches .ts but not .d.ts (Without using negative lookback, which is not supported)

  const rsyncScript = s.hereRelative("../../helper-scripts/rsync-non-ts.sh");
  console.log(rsyncScript);
  const tsc: Executable = ["tsc", outDir.concat(args)];
  const chokidar = `chokidar -i '${fileExtRx}' --initial --verbose -c '${rsyncScript} {event} {path}' 'src'`;

  return project.executeSync({ tsc, rsync: willWatch ? chokidar : rsyncScript });
};

export { script };
