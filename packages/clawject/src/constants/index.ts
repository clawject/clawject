import upath from 'upath';

/**
 * The Next line is parsed by the build script
 * */
const TS_VERSION_RANGE = '>=4.8 <=4.9';
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
