import { LanguageServiceLogger } from './LanguageServiceLogger';
import { cleanupAll } from '../core/cleaner/cleanup';
import { ConfigLoader } from '../config/ConfigLoader';

export const disposeLanguageService = () => {
  LanguageServiceLogger.log('Clawject language service plugin disposed');
  cleanupAll();
  ConfigLoader.clear();
};
