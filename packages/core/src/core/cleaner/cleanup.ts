import { ConfigurationRepository } from '../configuration/ConfigurationRepository';
import { ComponentRepository } from '../component/ComponentRepository';
import { BaseTypesRepository } from '../type-system/BaseTypesRepository';
import { ApplicationRepository } from '../application/ApplicationRepository';
import { Context } from '../../compilation-context/Context';

export const cleanup = (fileName: string): void => {
  ApplicationRepository.clearByFileName(fileName);
  ComponentRepository.clearByContextualFileName(fileName);
  BaseTypesRepository.clear();
};

export const cleanupAll = (): void => {
  Context.clearMessages();
  ConfigurationRepository.clear();
  ApplicationRepository.clear();
  ComponentRepository.clear();
  BaseTypesRepository.clear();
};
