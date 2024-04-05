import { ConfigurationRepository } from '../configuration/ConfigurationRepository';
import { ComponentRepository } from '../component/ComponentRepository';
import { BaseTypesRepository } from '../type-system/BaseTypesRepository';
import { FileGraph } from '../file-graph/FileGraph';
import { ApplicationRepository } from '../application/ApplicationRepository';
import { Context } from '../../compilation-context/Context';

export const cleanup = (fileName: string): void => {
  Context.clearMessagesByFileName(fileName);

  ApplicationRepository.clearByFileName(fileName);
  ComponentRepository.clearByContextualFileName(fileName);
  FileGraph.clearByFileName(fileName);
  BaseTypesRepository.clear();
};

export const cleanupAll = (): void => {
  Context.clear();
  ConfigurationRepository.clear();
  ApplicationRepository.clear();
  ComponentRepository.clear();
  BaseTypesRepository.clear();
  FileGraph.clear();
  BaseTypesRepository.clear();
};
