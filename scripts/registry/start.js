const path = require('path');
const execSh =  require("exec-sh").promise;

const rootDir = path.join(__dirname, '../../');

(async () => {
  await execSh(`yarn run nx local-registry`);
})();
