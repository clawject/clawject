import ts from 'typescript';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';
import { processConfigurationOrApplicationClass } from './processConfigurationOrApplicationClass';
import { transformConfigurationOrApplicationClass } from './transformers/transformConfigurationOrApplicationClass';
import { ApplicationRepository } from '../application/ApplicationRepository';
import { processApplication } from './processApplication';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { processImplicitComponents } from './processImplicitComponents';
import { Value } from '../../../runtime/types/Value';
import { Logger } from '../../logger/Logger';

export const processClassDeclaration = (node: ts.ClassDeclaration, transformationContext: ts.TransformationContext, shouldAddInternalImport: Value<boolean>): ts.Node => {
  const configurationDecoratorMetadata = extractDecoratorMetadata(node, DecoratorKind.Configuration);
  const clawjectApplicationDecoratorMetadata = extractDecoratorMetadata(node, DecoratorKind.ClawjectApplication);

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

    if (getCompilationContext().languageServiceMode) {
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
