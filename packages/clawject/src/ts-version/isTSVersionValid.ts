import { ConfigLoader } from '../compile-time/config/ConfigLoader';
import semver from 'semver/preload';
import { CONSTANTS } from '../constants';

export const isTSVersionValid = (version: string): boolean => {
  if (ConfigLoader.get().unsafeTSVersion) {
    return true;
  }

  return semver.satisfies(version, CONSTANTS.tsVersionRange);
};
