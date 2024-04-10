import type * as ts from 'typescript';
import { processConfigurationOrApplicationClass } from './processConfigurationOrApplicationClass';
import { transformConfigurationOrApplicationClass } from './transformers/transformConfigurationOrApplicationClass';
import { ApplicationRepository } from '../application/ApplicationRepository';
import { processApplication } from './processApplication';
import { processImplicitComponents } from './processImplicitComponents';
import { Logger } from '../../logger/Logger';
import { Context } from '../../compilation-context/Context';
import { Value } from '../utils/Value';
import { DecoratorProcessor } from '../decorators/DecoratorProcessor';
import { BaseDecorators } from '../decorators/BaseDecorators';

export const processClassDeclaration = (node: ts.ClassDeclaration, shouldAddInternalImport: Value<boolean>): ts.Node => {
  const configurationDecoratorMetadata = DecoratorProcessor.extractFirstDecoratorEntity(node, BaseDecorators.Configuration);
  const clawjectApplicationDecoratorMetadata = DecoratorProcessor.extractFirstDecoratorEntity(node, BaseDecorators.ClawjectApplication);

  let transformed: ts.Node = node;

  if (configurationDecoratorMetadata !== null || clawjectApplicationDecoratorMetadata !== null) {
    const processConfigurationOrApplicationLabel = `Processing configuration or application class, file: ${node.getSourceFile().fileName}, class: ${node.name?.text}`;
    Logger.verboseDuration(processConfigurationOrApplicationLabel);
    const configuration = processConfigurationOrApplicationClass(node, null, null);
    Logger.verboseDuration(processConfigurationOrApplicationLabel);

    if (configuration === null) {
      return node;
    }

    shouldAddInternalImport.value = true;

    const application = clawjectApplicationDecoratorMetadata === null ? null : ApplicationRepository.register(node, configuration);

    if (application !== null) {
      const label = `Processing application, file: ${node.getSourceFile().fileName}, class: ${node.name?.text}`;
      Logger.verboseDuration(label);
      processApplication(application);
      Logger.verboseDuration(label);
    }

    if (Context.languageServiceMode) {
      return node;
    }

    const transformConfigurationOrApplicationLabel = `Transforming configuration or application class, file: ${node.getSourceFile().fileName}, class: ${node.name?.text}`;
    Logger.verboseDuration(transformConfigurationOrApplicationLabel);
    transformed = transformConfigurationOrApplicationClass(transformed as ts.ClassDeclaration, configuration, application);
    Logger.verboseDuration(transformConfigurationOrApplicationLabel);
  } else {
    transformed = processImplicitComponents(node, shouldAddInternalImport);
  }

  return transformed;
};
