import { ConfigurationRepository } from '../configuration/ConfigurationRepository';
import { ApplicationRepository } from '../application/ApplicationRepository';
import { Context } from '../../compilation-context/Context';

export const cleanup = (fileName: string): void => {
  ApplicationRepository.clearByFileName(fileName);
};

export const cleanupAll = (): void => {
  Context.clearMessages();
  ConfigurationRepository.clear();
  ApplicationRepository.clear();
};
