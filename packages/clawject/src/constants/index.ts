import upath from 'upath';

/** this line is parsed by the build script */
const TS_VERSION_RANGE = '>=5.0 <=5.4';

export const CONSTANTS = {
  libraryName: '@clawject/di',
  libraryImportName: '$clawject_di',
  packageRootDir: upath.resolve(__dirname, '../../../'),
  typeReferenceTablePath: upath.resolve(__dirname, '../../types/index.d.ts'),
  tsVersionRange: TS_VERSION_RANGE,
};

if (process.env['CLAWJECT_DEBUG_MODE'] === 'true') {
  CONSTANTS.packageRootDir = upath.join(process.cwd(), 'node_modules/@clawject/di');
  CONSTANTS.typeReferenceTablePath = upath.join(process.cwd(), 'node_modules/@clawject/di/dist/types/index.d.ts');
}

if (process.env['CLAWJECT_TEST_MODE'] === 'true') {
  CONSTANTS.packageRootDir = '/node_modules/@clawject/di';
  CONSTANTS.typeReferenceTablePath = '/node_modules/@clawject/di/dist/types/index.d.ts';
}
