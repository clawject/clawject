import { LanguageServiceLogger } from './LanguageServiceLogger';
import { cleanupAll } from '../compile-time/core/cleaner/cleanup';
import { ConfigLoader } from '../compile-time/config/ConfigLoader';
import { Compiler } from './Compiler';
import { LanguageServiceCache } from './LanguageServiceCache';
import { ModificationTracker } from './ModificationTracker';
import { LanguageService } from './LanguageService';

export const disposeLanguageService = () => {
  LanguageServiceLogger.log('Clawject language service plugin disposed');
  cleanupAll();
  ConfigLoader.clear();
  Compiler.wasCompiled = false;
  LanguageServiceCache.clear();
  ModificationTracker.clear();
  LanguageService.configFileErrors = [];
};
