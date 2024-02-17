import { ConfigurationRepository } from '../configuration/ConfigurationRepository';
import { ComponentRepository } from '../component/ComponentRepository';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { BaseTypesRepository } from '../type-system/BaseTypesRepository';
import { FileGraph } from '../file-graph/FileGraph';
import { ApplicationRepository } from '../application/ApplicationRepository';

export const cleanup = (fileName: string): void => {
  getCompilationContext().clearMessagesByFileName(fileName);

  ApplicationRepository.clearByFileName(fileName);
  ComponentRepository.clearByContextualFileName(fileName);
  FileGraph.clearByFileName(fileName);
  BaseTypesRepository.clear();
};

export const cleanupAll = (): void => {
  getCompilationContext().clear();
  ConfigurationRepository.clear();
  ApplicationRepository.clear();
  ComponentRepository.clear();
  BaseTypesRepository.clear();
  FileGraph.clear();
  BaseTypesRepository.clear();
};
