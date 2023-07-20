import { ConfigLoader } from '../compile-time/config/ConfigLoader';
import semver from 'semver/preload';

export const isTSVersionValid = (version: string): boolean => {
  if (ConfigLoader.get().unsafeTSVersion) {
    return true;
  }

  let packageJson: any;

  try {
    packageJson = require('../package.json');
  } catch (e) {
    packageJson = require('../../package.json');
  }


  return semver.satisfies(version, packageJson.peerDependencies.typescript);
};
