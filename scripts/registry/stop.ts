import execShAll from "exec-sh";

const execSh = execShAll.promise;

(async () => {
  try {
    await execSh("pm2 delete clawject-local-registry");
  } catch (error) {
    console.log('Registry not running')
  }
})();
