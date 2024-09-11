const process = require('process');
const {spawn} = require('child_process');
const path = require('path');
const {readdir} = require('fs').promises;

(async () => {
  const tsVersion = process.env['TS_VERSION'] || '5.6';

  if (!tsVersion) {
    console.error('TS_VERSION environment variable is not set');
    process.exit(1);
  }

  const directories = await getDirectories(__dirname);

  let globalCode = 0;

  const promiseResolvers = [];
  const promises = directories.map((_, index) => new Promise(resolve => {
    promiseResolvers[index] = resolve;
  }))

  for (let i = 0; i < directories.length; i++) {
    const directory = directories[i];

    const packageJsonPath = path.join(__dirname, directory, 'package.json');
    const packageJson = require(packageJsonPath);

    const clawjectPackages = Object.keys(packageJson.dependencies || {}).filter(dep => dep.startsWith('@clawject/'));
    const clawjectPackagesToInstall = clawjectPackages.map(dep => `${dep}`).join(' ');
    const commands = [
      'rm -rf node_modules',
      `yarn remove ${clawjectPackages.join(' ')}`,
      'yarn',
      `yarn add ${clawjectPackagesToInstall} typescript@${tsVersion} ts-patch@3.2.1`,
      'yarn run ts-patch install -s',
      'jest --clear-cache',
      'jest'
    ]

    const command = commands.join(' && ');

    const spawnedProcess = spawn(
      'sh',
      ['-c', command],
      {
        cwd: path.join(__dirname, directory),
        env: process.env,
        stdio: 'inherit',
        encoding: 'utf-8'
      },
    );

    spawnedProcess.on('exit', (code) => {
      promiseResolvers[i](code);
      globalCode = code || 0;
    });

    await promises[i];

    if (globalCode !== 0) {
      break;
    }
  }

  process.exit(globalCode);
})();

async function getDirectories(source) {
  return (await readdir(source, {withFileTypes: true}))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}
