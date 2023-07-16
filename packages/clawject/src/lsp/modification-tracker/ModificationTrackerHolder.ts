import type tsServer from 'typescript/lib/tsserverlibrary';
import { ModificationTracker } from './ModificationTracker';

export class ModificationTrackerHolder {
  static cache = new Map<string, ModificationTracker>();

  static getForProject(project: string, info: tsServer.server.PluginCreateInfo): ModificationTracker {
    const modificationTracker = this.cache.get(project) ?? new ModificationTracker(info);
    modificationTracker.tryInit();

    this.cache.set(project, modificationTracker);

    return modificationTracker;
  }

  static invalidateForProject(project: string): void {
    this.cache.delete(project);
  }
}

// getCompileOnSaveAffectedFileList
