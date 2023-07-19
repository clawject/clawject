import upath from 'upath';

export const CONSTANTS = {
  libraryName: 'clawject',
  packageRootDir: upath.resolve(__dirname, '../'),
  typeReferenceTablePath: upath.resolve(__dirname, '../runtime/___TypeReferenceTable___.d.ts'),
  packageJsonPath: upath.resolve(__dirname, '../package.json'),
  languageServicePluginName: 'clawject-language-service',
};

if (process.env['CLAWJECT_DEBUG_MODE'] === 'true') {
  CONSTANTS.packageRootDir = upath.join(process.cwd(), 'node_modules/clawject');
  CONSTANTS.typeReferenceTablePath = upath.join(process.cwd(), 'node_modules/clawject/runtime/___TypeReferenceTable___.ts');
  CONSTANTS.packageJsonPath = upath.join(CONSTANTS.packageRootDir, 'package.json');
}
