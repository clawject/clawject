import * as semver from 'semver';
import { CONSTANTS } from '../constants';
import { ConfigLoader } from '../config/ConfigLoader';

export const isTSVersionValid = (version: string): boolean => {
  if (ConfigLoader.get().unsafeTSVersion) {
    return true;
  }

  return semver.satisfies(version, CONSTANTS.tsVersionRange);
};
