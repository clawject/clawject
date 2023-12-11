import { ConfigurationRepository } from '../configuration/ConfigurationRepository';
import { ComponentRepository } from '../component/ComponentRepository';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { BaseTypesRepository } from '../type-system/BaseTypesRepository';
import { FileGraph } from '../file-graph/FileGraph';

export const cleanup = (fileName: string): void => {
  getCompilationContext().clearByFileName(fileName);
  ConfigurationRepository.clearByFileName(fileName);
  ComponentRepository.clearByContextualFileName(fileName);
  FileGraph.clearByFileName(fileName);
};

export const cleanupAll = (): void => {
  getCompilationContext().clear();
  ConfigurationRepository.clear();
  ComponentRepository.clear();
  BaseTypesRepository.clear();
  FileGraph.clear();
};
