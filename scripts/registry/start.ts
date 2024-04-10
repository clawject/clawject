import fs from "fs";
import * as process from "node:process";
import { runServer } from "verdaccio";
import path from "path";
import execShAll from "exec-sh";

const execSh = execShAll.promise;

const rootDir = path.join(__dirname, '../../');

(async () => {
  await execSh(`rm -rf ${path.join(rootDir, '.verdaccio/local-registry')}`);
  const server = await runServer(path.join(rootDir, '.verdaccio/config.yml'));
  server.listen(4873, async() => {
    await publish();

    console.log('Registry started');
  });
})();

async function publish() {
  const packagesDir = path.resolve(rootDir, 'packages');
  const packages = await fs.promises.readdir(packagesDir);

  await Promise.all(packages.map(pkg => {
    const basePath = path.join(packagesDir, pkg);
    const packageJson = require(path.join(basePath, 'package.json'));

    if (!packageJson.name.startsWith('@clawject')) {
      return;
    }

    let distPath = path.join(basePath, 'dist');

    if (!fs.existsSync(distPath)) {
      distPath = path.dirname(distPath);
    }

    return execSh(`npm publish ${distPath} --access public --force --registry http://localhost:4873`);
  }))
}
