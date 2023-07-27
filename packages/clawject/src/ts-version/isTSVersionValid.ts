import { ConfigLoader } from '../compile-time/config/ConfigLoader';
import semver from 'semver/preload';
import { CONSTANTS } from '../constants';

export const isTSVersionValid = (version: string): boolean => {
  if (ConfigLoader.get().unsafeTSVersion) {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageJson = require(CONSTANTS.packageJsonPath);

  return semver.satisfies(version, packageJson.peerDependencies.typescript);
};
