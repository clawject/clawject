import execShAll from "exec-sh";

const execSh = execShAll.promise;

(async () => {
  await execSh(`node_modules/.bin/tsc --project tsconfig.debug.json`);
})()
