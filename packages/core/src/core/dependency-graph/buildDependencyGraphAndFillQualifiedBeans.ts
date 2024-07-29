import { Dependency } from '../dependency/Dependency';
import { Bean } from '../bean/Bean';
import { CanNotRegisterBeanError } from '../../compilation-context/messages/errors/CanNotRegisterBeanError';
import { BeanKind } from '../bean/BeanKind';
import { Application } from '../application/Application';
import { DependencyResolver } from '../dependency-resolver/DependencyResolver';
import { Context } from '../../compilation-context/Context';

export const buildDependencyGraphAndFillQualifiedBeans = (application: Application, beans: Bean[]) => {
  for (const bean of beans) {
    if (Context.isCancellationRequested()) {
      return;
    }

    //Skipping beans that are embedded (really embedded)
    if (bean.embeddedParent !== null) {
      continue;
    }

    const beanCandidates = getBeanCandidates(bean, beans, application);
    const missingDependencies: Dependency[] = [];

    bean.dependencies.forEach(dependency => {
      const maybeResolvedDependency = DependencyResolver.resolveDependencies(dependency, beanCandidates, bean, application);

      if (!maybeResolvedDependency.isResolved()) {
        missingDependencies.push(dependency);
      }

      application.dependencyGraph.addNodeWithEdges(bean, maybeResolvedDependency.getAllResolvedBeans());
      application.registerResolvedDependency(bean, maybeResolvedDependency);
    });

    if (missingDependencies.length > 0 && bean.kind === BeanKind.CLASS_CONSTRUCTOR) {
      Context.report(new CanNotRegisterBeanError(
        null,
        bean.node,
        bean.parentConfiguration,
        application,
        missingDependencies,
      ));
    }
  }
};

function getBeanCandidates(bean: Bean, beans: Bean[], application: Application): Bean[] {
  const beanParentConfiguration = bean.parentConfiguration;

  if (bean.dependencies.size === 0) {
    return [];
  }

  return beans.filter(it => {
    //Filtering out the bean itself
    if (it === bean) {
      return false;
    }

    //Filtering out beans that are embeddeds from current bean
    if (it.embeddedParent === bean) {
      return false;
    }

    if (it.isLifecycle()) {
      return false;
    }

    //Accepting all beans from the current configuration
    if (it.parentConfiguration === beanParentConfiguration) {
      return true;
    }

    if (!it.getExternalValue()) {
      return false;
    }

    const itConfiguration = it.parentConfiguration;
    const resolvedConfigurationImport = application.resolvedImports.get(itConfiguration);

    if (!resolvedConfigurationImport) {
      return true;
    }

    const isItImportedAsExternal = resolvedConfigurationImport.getExternalValue();

    if (isItImportedAsExternal) {
      return true;
    }

    return resolvedConfigurationImport.imports.some(imported => beanParentConfiguration.importRegister.hasElement(imported));
  });
}
