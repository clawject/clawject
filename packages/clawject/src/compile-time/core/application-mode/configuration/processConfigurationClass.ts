import ts from 'typescript';
import { ConfigurationRepository } from '../../configuration/ConfigurationRepository';
import { registerBeans } from '../../bean/registerBeans';
import { registerBeanDependencies } from '../../dependency/registerBeanDependencies';
import { registerAutowired } from '../../autowired/registerAutowired';
import { getCompilationContext } from '../../../../transformer/getCompilationContext';
import { NotSupportedError } from '../../../compilation-context/messages/errors/NotSupportedError';
import { transformConfigurationClass } from './transformation/transformConfigurationClass';

//TODO consider allowing constructor parameters in configuration classes
export const processConfigurationClass = (node: ts.ClassDeclaration): ts.ClassDeclaration => {
  const compilationContext = getCompilationContext();
  const configuration = ConfigurationRepository.register(node);

  if (node.members.some(ts.isConstructorDeclaration)) {
    compilationContext.report(new NotSupportedError(
      'Configuration classes cannot have constructor.',
      node,
      null,
    ));
    return node;
  }

  registerBeans(configuration);
  registerBeanDependencies(configuration);
  registerAutowired(configuration);

  return transformConfigurationClass(configuration);
};
