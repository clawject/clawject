const fs = require('fs');
const process = require('process');
const {spawn} = require('child_process');
const path = require('path');

(async() => {
  const tsVersion = process.argv[2];

  const command = `yarn up typescript@${tsVersion} ts-patch@3.1.2 && ts-patch install -s && jest --clear-cache && jest`;
  const spawnedProcess = spawn(
    'sh',
    ['-c', command],
    {
      cwd: process.cwd(),
      env: process.env,
      stdio: 'inherit',
      encoding: 'utf-8'
    },
  );
  spawnedProcess.on('exit', (code) => {
    process.exit(code);
  });
})();
