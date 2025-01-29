import type ts from 'typescript';
import { processConfigurationClass } from './processConfigurationClass';
import { ClassDefinitionsAccessor } from '../ClassDefinitionsAccessor';
import { ApplicationRepository } from '../application/ApplicationRepository';
import { processApplication } from './process-application/processApplication';

export const processClassDeclaration = (node: ts.ClassDeclaration): void => {
  const classDefinitions = ClassDefinitionsAccessor.getDefinition(node);
  //TODO consider register any class as a configuration
  if (classDefinitions.isEmpty()) {
    //Not a configuration or application class
    return;
  }

  const configuration = processConfigurationClass(node, null, null);
  if (!configuration) {
    return;
  }

  if (classDefinitions.applications.length === 0) {
    return;
  }

  const application = ApplicationRepository.register(node, configuration);

  processApplication(application);
};
