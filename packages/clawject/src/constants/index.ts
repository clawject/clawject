import upath from 'upath';

export const CONSTANTS = {
  libraryName: 'clawject',
  packageRoot: upath.resolve(__dirname, '../index.d.ts'),
  packageRootDir: upath.resolve(__dirname, '../'),
  packageJsonPath: upath.resolve(__dirname, '../package.json'),
  languageServicePluginName: 'clawject-language-service-plugin',
};

if (process.env['CLAWJECT_DEBUG_MODE'] === 'true') {
  CONSTANTS.packageRootDir = upath.join(process.cwd(), 'node_modules/clawject');
  CONSTANTS.packageJsonPath = upath.join(CONSTANTS.packageRootDir, 'package.json');
  CONSTANTS.packageRoot = upath.join(CONSTANTS.packageRootDir, 'index.d.ts');
}
