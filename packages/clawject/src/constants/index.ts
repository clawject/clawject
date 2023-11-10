import upath from 'upath';

/** this line is parsed by the build script */
const TS_VERSION_RANGE = '>=4.8 <=5.2';
/** this line is replaced by the build script */
const LIBRARY_VERSION = '0.0.0';

export const CONSTANTS = {
  libraryName: 'clawject',
  packageRootDir: upath.resolve(__dirname, '../../../'),
  typeReferenceTablePath: upath.resolve(__dirname, '../../../index.d.ts'),
  libraryVersion: LIBRARY_VERSION,
  tsVersionRange: TS_VERSION_RANGE,
};

if (process.env['CLAWJECT_DEBUG_MODE'] === 'true') {
  CONSTANTS.packageRootDir = upath.join(process.cwd(), 'node_modules/clawject');
  CONSTANTS.typeReferenceTablePath = upath.join(process.cwd(), 'node_modules/clawject/index.d.ts');
}

if (process.env['CLAWJECT_TEST_MODE'] === 'true') {
  CONSTANTS.packageRootDir = '/node_modules/clawject';
  CONSTANTS.typeReferenceTablePath = '/node_modules/clawject/index.d.ts';
}
