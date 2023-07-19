import { ConfigurationRepository } from '../configuration/ConfigurationRepository';
import { ComponentRepository } from '../component/ComponentRepository';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { FileGraph } from '../file-graph/FileGraph';
import { BaseTypesRepository } from '../type-system/BaseTypesRepository';

export const cleanup = (fileName: string): void => {
  getCompilationContext().clearMessagesByFileName(fileName);
  ConfigurationRepository.clearByFileName(fileName);
  ComponentRepository.clearByFileName(fileName);
  FileGraph.clearByFileName(fileName);
};

export const cleanupAll = (): void => {
  getCompilationContext().clear();
  ConfigurationRepository.clear();
  ComponentRepository.clear();
  BaseTypesRepository.clear();
  FileGraph.clear();
};
