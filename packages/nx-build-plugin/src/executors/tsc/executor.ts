import { TscExecutorSchema } from './schema';
import { ExecutorContext } from 'nx/src/config/misc-interfaces';
import exec_sh_base from 'exec-sh';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import baseApiExtractor from './baseApiExtractor.json';
import { copyFile } from './utils/copyFile';
const execSh = exec_sh_base.promise;

export default async function runExecutor(options: TscExecutorSchema, context: ExecutorContext) {
  options.packageDir = context.workspace!.projects[context.projectName!].root;
  options.sourceRoot = context.workspace!.projects[context.projectName!].sourceRoot!;
  options.additionalEntryPoints = options.additionalEntryPoints || [];
  options.extractApi = Boolean(options.extractApi);
  options.generateExportsFields = Boolean(options.generateExportsFields);
  options.copyFiles = options.copyFiles || [];

  const tmpDir = createTmpDir(context);

  try {
    await execute(tmpDir, options, context);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: error.message };
  } finally {
    // fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

async function execute(tmpDir: string, options: TscExecutorSchema, context: ExecutorContext) {
  await tsc(tmpDir, options);
  if (options.extractApi) {
    await extractApi(tmpDir, options, context);
  }
  await packageJson(tmpDir, options);
  await copyFiles(tmpDir, options, context);
  await copyBuiltFiles(tmpDir, options, context);
}

async function tsc(tmpDir: string, options: TscExecutorSchema) {
  const flags = [
    `--project ${options.tsconfig}`,
    `--outDir ${tmpDir}/tsc-out`,
    options.extractApi ? `--declaration --declarationDir ${tmpDir}/tsc-api` : '--declaration',
  ].filter(Boolean);

  const tscCommand = `node_modules/.bin/tsc ${flags.join(' ')}`;
  await execSh(tscCommand);

  mkdir(tmpDir, 'dist');
  move(`${tmpDir}/tsc-out/${options.sourceRoot}`, `${tmpDir}/dist`);
  options.extractApi && move(`${tmpDir}/tsc-api/${options.sourceRoot}`, `${tmpDir}/dist/raw-types`);
  rm(`${tmpDir}/tsc-out`);
  rm(`${tmpDir}/tsc-api`);

  return { success: true };
}

async function extractApi(tmpDir: string, options: TscExecutorSchema, context: ExecutorContext) {
  const apiExtractorJson: any = baseApiExtractor;
  apiExtractorJson.projectFolder = path.join(context.root, options.packageDir);
  apiExtractorJson.compiler.tsconfigFilePath = path.join(context.root, options.tsconfig);

  const pathsToExtract: TscExecutorSchema['additionalEntryPoints'] = [
    { route: '', filePath: 'index' },
    ...options.additionalEntryPoints,
  ];

  for (const { filePath} of pathsToExtract) {
    apiExtractorJson.mainEntryPointFilePath = path.join(tmpDir, `dist/raw-types/${filePath}.d.ts`);
    apiExtractorJson.dtsRollup.untrimmedFilePath = path.join(tmpDir, `dist/untrimmed-types/${filePath}.d.ts`);
    apiExtractorJson.dtsRollup.publicTrimmedFilePath = path.join(tmpDir, `dist/${filePath}.d.ts`);

    fs.writeFileSync(path.join(tmpDir, 'api-extractor.json'), JSON.stringify(apiExtractorJson, null, 2));

    await execSh(`node_modules/.bin/api-extractor run --local --verbose -c ${tmpDir}/api-extractor.json`);
  }
  rm(`${tmpDir}/dist/raw-types`);
  rm(`${tmpDir}/dist/untrimmed-types`);
  rm(`${tmpDir}/api-extractor.json`);
}

async function packageJson(tmpDir: string, options: TscExecutorSchema) {
  const packageJson = JSON.parse(fs.readFileSync(path.join(options.packageDir, 'package.json'), 'utf-8'));
  if (options.generateExportsFields) {
    packageJson.exports = {
      '.': {
        types: './index.d.ts',
        import: './index.js',
        require: './index.js',
        default: './index.js',
      },
      './package.json': './package.json',
    };

    if (options.additionalEntryPoints) {
      for (const {
        route,
        filePath,
      } of options.additionalEntryPoints) {
        packageJson.exports[`./${route}`] = {
          types: `./${filePath}.d.ts`,
          import: `./${filePath}.js`,
          require: `./${filePath}.js`,
          default: `./${filePath}.js`,
        };
      }
    }
  }

  fs.writeFileSync(path.join(tmpDir, 'dist/package.json'), JSON.stringify(packageJson, null, 2));
}

async function copyFiles(tmpDir: string, options: TscExecutorSchema, context: ExecutorContext) {
  for (const {from, to, glob} of options.copyFiles) {
    if (glob) {
      await execSh(`${path.join(context.cwd, 'node_modules/.bin', 'copyfiles')} -u 1 ${from} ${tmpDir}/dist/${to}`, { cwd: path.join(context.cwd, options.packageDir) });
    } else {
      await copyFile(path.join(options.packageDir, from), path.join(tmpDir, 'dist', to));
    }
  }
}

async function copyBuiltFiles(tmpDir: string, options: TscExecutorSchema, context: ExecutorContext) {
  const dest = path.join(options.packageDir, 'dist');
  rm(dest);
  mkdir(dest);

  move(
    path.join(tmpDir, 'dist'),
    dest
  );
}

function createTmpDir(context: ExecutorContext): string {
  //TODO uncomment
  // const tmpDir = path.join(context.cwd, 'tmp', uuid());
  const tmpDir = path.join(context.cwd, 'tmp', 'build');
  rm(tmpDir);
  mkdir(tmpDir);
  return tmpDir;
}

function mkdir(...dirs: string[]) {
  const dir = path.join(...dirs);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function move(from: string, to: string) {
  fs.renameSync(path.normalize(from), path.normalize(to));
}

function rm(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}
