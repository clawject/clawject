import upath from 'upath';

/** this line is parsed by the build script */
const TS_VERSION_RANGE = '>=5.0 <=5.9';

export const CONSTANTS = {
  libraryName: '@clawject/di',
  libraryImportName: 'claw',
  //nx-ignore-next-line
  packageRootDir: upath.dirname(require.resolve('@clawject/di')),
  //nx-ignore-next-line
  typeReferenceTablePath: upath.resolve(upath.dirname(require.resolve('@clawject/di')), 'index.d.ts'),
  tsVersionRange: TS_VERSION_RANGE,
  debugMode: process.env['CLAWJECT_DEBUG_MODE'] === 'a605c4e7fe80432fb637fabef15263b1',
  testMode: process.env['CLAWJECT_TEST_MODE'] === 'true',
};

if (CONSTANTS.debugMode) {
  //nx-ignore-next-line
  CONSTANTS.typeReferenceTablePath = upath.resolve(upath.dirname(require.resolve('@clawject/di')), 'runtime/api/___TypeReferenceTable___.ts');
}

if (CONSTANTS.testMode) {
  CONSTANTS.packageRootDir = '/node_modules/@clawject/di';
  CONSTANTS.typeReferenceTablePath = '/node_modules/@clawject/di/index.d.ts';
}
