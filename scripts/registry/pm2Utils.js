const pm2 = require('pm2');

function pm2Delete(processName) {
  return new Promise((resolve, reject) => {
    pm2.delete(processName, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  })
}

function pm2Start(script, processName) {
  return new Promise((resolve, reject) => {
    pm2.start(script, { name: processName }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  })
}

module.exports = {
  pm2Delete,
  pm2Start
}
