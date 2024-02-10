import { Configuration } from '../configuration/Configuration';
import { DependencyGraph } from './DependencyGraph';
import { Dependency } from '../dependency/Dependency';
import { Bean } from '../bean/Bean';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { CanNotRegisterBeanError } from '../../compilation-context/messages/errors/CanNotRegisterBeanError';
import { BeanKind } from '../bean/BeanKind';
import { Application } from '../application/Application';
import { DependencyResolver } from '../dependency-resolver/DependencyResolver';

export const buildDependencyGraphAndFillQualifiedBeans = (configurationOrApplication: Configuration | Application, beans: Bean[], dependencyGraph: DependencyGraph) => {
  const compilationContext = getCompilationContext();

  beans.forEach(bean => {
    //TODO check for external and internal beans
    const allBeansWithoutCurrentAndWithoutExternalInternalBeans = beans
      .filter(it => {
        return it !== bean;
      });
    const missingDependencies: Dependency[] = [];

    bean.dependencies.forEach(dependency => {
      const maybeResolvedDependency = DependencyResolver.resolveDependencies(dependency, allBeansWithoutCurrentAndWithoutExternalInternalBeans, bean);

      if (!maybeResolvedDependency.isResolved()) {
        missingDependencies.push(dependency);
      }

      dependencyGraph.addNodeWithEdges(bean, maybeResolvedDependency.getAllResolvedBeans());
      configurationOrApplication.registerResolvedDependency(bean, maybeResolvedDependency);
    });

    if (missingDependencies.length > 0 && bean.kind === BeanKind.CLASS_CONSTRUCTOR) {
      compilationContext.report(new CanNotRegisterBeanError(
        null,
        bean.node,
        bean.parentConfiguration,
        missingDependencies,
      ));
    }
  });
};
