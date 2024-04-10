const pm2 = require('pm2');
const pm2Utils = require('./pm2Utils.js');

const processName = 'clawject-local-registry';
const expectedOutput = 'http address -';

(async() => {
  try {
    await pm2Utils.pm2Delete(processName);
  } catch (err) {
    console.log('Registry not running')
  }

  await pm2Utils.pm2Start('scripts/registry/start.js', processName);

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
