import { LanguageServiceLogger } from './LanguageServiceLogger';
import { Compiler } from './Compiler';
import { ModificationTracker } from './ModificationTracker';
import { LanguageService } from './LanguageService';
import { cleanupAll } from '../core/cleaner/cleanup';
import { ConfigLoader } from '../config/ConfigLoader';

export const disposeLanguageService = () => {
  LanguageServiceLogger.log('Clawject language service plugin disposed');
  cleanupAll();
  ConfigLoader.clear();
  Compiler.wasCompiled = false;
  ModificationTracker.clear();
  LanguageService.configFileErrors = [];
};
