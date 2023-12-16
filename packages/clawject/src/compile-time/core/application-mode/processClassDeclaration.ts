import ts from 'typescript';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';
import { processConfigurationOrApplicationClass } from './processConfigurationOrApplicationClass';
import { transformConfigurationOrApplicationClass } from './transformConfigurationOrApplicationClass';
import { ApplicationRepository } from '../application/ApplicationRepository';
import { processApplication } from './processApplication';

export const processClassDeclaration = (node: ts.ClassDeclaration): ts.Node => {
  const configurationDecoratorMetadata = extractDecoratorMetadata(node, DecoratorKind.Configuration);
  const clawjectApplicationDecoratorMetadata = extractDecoratorMetadata(node, DecoratorKind.ClawjectApplication);

  let transformed = node;

  if (configurationDecoratorMetadata !== null || clawjectApplicationDecoratorMetadata !== null) {
    const configuration = processConfigurationOrApplicationClass(node);
    const application = clawjectApplicationDecoratorMetadata === null ? null : ApplicationRepository.register(node);

    if (application !== null) {
      processApplication(application, configuration);
    }

    transformed = transformConfigurationOrApplicationClass(transformed, configuration, application);
  }

  return transformed;
};
