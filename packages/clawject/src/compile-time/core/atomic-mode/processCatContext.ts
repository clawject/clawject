import ts from 'typescript';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { ConfigurationRepository } from '../configuration/ConfigurationRepository';
import { IncorrectNameError } from '../../compilation-context/messages/errors/IncorrectNameError';
import { registerBeans } from '../bean/registerBeans';
import { checkIsAllBeansRegisteredInContextAndFillBeanRequierness } from '../bean/checkIsAllBeansRegisteredInContextAndFillBeanRequierness';
import { registerBeanDependencies } from '../dependency/registerBeanDependencies';
import { buildDependencyGraphAndFillQualifiedBeans } from '../dependency-graph/buildDependencyGraphAndFillQualifiedBeans';
import { reportAboutCircularDependencies } from '../report-cyclic-dependencies/reportAboutCircularDependencies';
import { transformContext } from './transformers/transformContext';
import { isNameReserved } from '../utils/isNameReserved';
import { getConfigurationLazyExpressionValue } from './transformers/getConfigurationLazyExpressionValue';
import { getConfigurationScopeExpressionValue } from './transformers/getConfigurationScopeExpressionValue';
import { DependencyGraph } from '../dependency-graph/DependencyGraph';

export function processCatContext(node: ts.ClassDeclaration, compilationContext: CompilationContext): ts.Node {
  const configuration = ConfigurationRepository.register(node);
  configuration.lazyExpression.node = getConfigurationLazyExpressionValue(configuration);
  configuration.scopeExpression.node = getConfigurationScopeExpressionValue(configuration);

  const restrictedClassMembersByName = node.members
    .filter(it => isNameReserved(it.name?.getText() ?? ''));

  if (restrictedClassMembersByName.length !== 0) {
    restrictedClassMembersByName.forEach(it => {
      compilationContext.report(new IncorrectNameError(
        `'${it.name?.getText()}' name is reserved for the di-container.`,
        it,
        configuration,
      ));
    });
    return node;
  }

  //Processing beans
  registerBeans(configuration);
  checkIsAllBeansRegisteredInContextAndFillBeanRequierness(configuration);
  registerBeanDependencies(configuration);
  buildDependencyGraphAndFillQualifiedBeans(configuration, Array.from(configuration.beanRegister.elements), DependencyGraph.global);
  reportAboutCircularDependencies(DependencyGraph.global);

  if (compilationContext.languageServiceMode) {
    return node;
  }

  return transformContext(node, configuration);
}
