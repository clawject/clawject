import { ConfigLoader } from '../compile-time/config/ConfigLoader';
import { CONSTANTS } from '../constants';
import { get } from 'lodash';
import semver from 'semver/preload';
import tsServer from 'typescript/lib/tsserverlibrary';

let cachedTSVersion: string | null = null;

export const isTSVersionValid = (version: string, pluginInfo: tsServer.server.PluginCreateInfo): boolean => {
  if (ConfigLoader.get().unsafeTSVersion) {
    return true;
  }

  if (cachedTSVersion === null) {
    const packageJson = pluginInfo.serverHost.readFile(CONSTANTS.packageJsonPath, 'utf-8');
    if (!packageJson) {
      return false;
    }

    const packageJsonParsed = JSON.parse(packageJson);
    const tsVersion: string | undefined = get(packageJsonParsed, 'peerDependencies.typescript', undefined);

    if (!tsVersion) {
      return false;
    }

    cachedTSVersion = tsVersion;
  }

  return semver.satisfies(version, cachedTSVersion);
};
