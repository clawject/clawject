import type * as ts from 'typescript';
import { processConfigurationOrApplicationClass } from './processConfigurationOrApplicationClass';
import { ApplicationRepository } from '../application/ApplicationRepository';
import { processApplication } from './processApplication';
import { Logger } from '../../logger/Logger';
import { DecoratorProcessor } from '../decorators/DecoratorProcessor';
import { BaseDecorators } from '../decorators/BaseDecorators';

export const processClassDeclaration = (node: ts.ClassDeclaration): void => {
  const configurationDecoratorMetadata = DecoratorProcessor.extractFirstDecoratorEntity(node, BaseDecorators.Configuration);
  const clawjectApplicationDecoratorMetadata = DecoratorProcessor.extractFirstDecoratorEntity(node, BaseDecorators.ClawjectApplication);

  if (configurationDecoratorMetadata !== null || clawjectApplicationDecoratorMetadata !== null) {
    const processConfigurationOrApplicationLabel = `Processing configuration or application class, file: ${node.getSourceFile().fileName}, class: ${node.name?.text}`;
    Logger.verboseDuration(processConfigurationOrApplicationLabel);
    const configuration = processConfigurationOrApplicationClass(node, null, null);
    Logger.verboseDuration(processConfigurationOrApplicationLabel);

    if (configuration === null) {
      return;
    }

    const application = clawjectApplicationDecoratorMetadata === null ? null : ApplicationRepository.register(node, configuration);

    if (application !== null) {
      const label = `Processing application, file: ${node.getSourceFile().fileName}, class: ${node.name?.text}`;
      Logger.verboseDuration(label);
      processApplication(application);
      Logger.verboseDuration(label);
    }
  }
};
