const pm2Utils = require('./pm2Utils.js');

(async () => {
  try {
    await pm2Utils.pm2Delete('clawject-local-registry');
  } catch (error) {
    console.log('Registry not running')
  }
  process.exit(0);
})();
