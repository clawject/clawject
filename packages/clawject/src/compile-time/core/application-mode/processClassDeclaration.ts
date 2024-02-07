import ts from 'typescript';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';
import { processConfigurationOrApplicationClass } from './processConfigurationOrApplicationClass';
import { transformConfigurationOrApplicationClass } from './transformers/transformConfigurationOrApplicationClass';
import { ApplicationRepository } from '../application/ApplicationRepository';
import { processApplication } from './processApplication';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { processImplicitComponents } from '../atomic-mode/processImplicitComponents';
import { Value } from '../../../runtime/Value';

export const processClassDeclaration = (node: ts.ClassDeclaration, shouldAddInternalImport: Value<boolean>): ts.Node => {
  const configurationDecoratorMetadata = extractDecoratorMetadata(node, DecoratorKind.Configuration);
  const clawjectApplicationDecoratorMetadata = extractDecoratorMetadata(node, DecoratorKind.ClawjectApplication);

  let transformed = node;

  if (configurationDecoratorMetadata !== null || clawjectApplicationDecoratorMetadata !== null) {
    const configuration = processConfigurationOrApplicationClass(node, null, null);

    if (configuration === null) {
      return processImplicitComponents(node, shouldAddInternalImport);
    }

    shouldAddInternalImport.value = true;

    const application = clawjectApplicationDecoratorMetadata === null ? null : ApplicationRepository.register(node, configuration);

    if (application !== null) {
      processApplication(application);
    }

    if (getCompilationContext().languageServiceMode) {
      return node;
    }

    transformed = transformConfigurationOrApplicationClass(transformed, configuration, application);
  }

  return transformed;
};
