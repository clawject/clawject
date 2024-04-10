import pm2 from "pm2";
import execShAll from "exec-sh";

const execSh = execShAll.promise;
const processName = 'clawject-local-registry';
const expectedOutput = 'Registry started';

(async() => {

  try {
    await execSh(`pm2 delete ${processName}`);
  } catch (err) {
    console.log('Registry not running')
  }

  const command = `pm2 start "ts-node scripts/registry/start.ts" --name ${processName}`
  await execSh(command);

  pm2.connect((err) => {
    if (err) {
      console.error(err);
      process.exit(2);
    }

    pm2.launchBus((err, bus) => {
      if (err) {
        console.error(err);
        process.exit(2);
      }

      console.log(`Waiting for output: "${expectedOutput}" from process: "${processName}"`);

      bus.on('log:out', (data) => {
        if (data.process.name === processName) {
          const logLine = data.data.toString().trim();
          console.log(`Log output: ${logLine}`);

          if (logLine.includes(expectedOutput)) {
            console.log(`Found expected output: "${expectedOutput}"`);
            pm2.disconnect();
            process.exit(0); // Exit the script
          }
        }
      });
    });
  });
})()
