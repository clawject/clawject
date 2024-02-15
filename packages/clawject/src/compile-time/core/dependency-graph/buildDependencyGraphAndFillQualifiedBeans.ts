import { Dependency } from '../dependency/Dependency';
import { Bean } from '../bean/Bean';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { CanNotRegisterBeanError } from '../../compilation-context/messages/errors/CanNotRegisterBeanError';
import { BeanKind } from '../bean/BeanKind';
import { Application } from '../application/Application';
import { DependencyResolver } from '../dependency-resolver/DependencyResolver';

export const buildDependencyGraphAndFillQualifiedBeans = (application: Application, beans: Bean[]) => {
  const compilationContext = getCompilationContext();

  beans.forEach(bean => {
    const beanParentConfiguration = bean.parentConfiguration;
    const beanCandidates = beans.filter(it => {
      //Filtering out the bean itself
      if (it === bean) {
        return false;
      }

      //Accepting all beans from the current configuration
      if (it.parentConfiguration === beanParentConfiguration) {
        return true;
      }

      if(!it.getExternalValue()) {
        return false;
      }

      const itConfiguration = it.parentConfiguration;
      const resolvedConfigurationImport = application.resolvedImports.get(itConfiguration);

      if (!resolvedConfigurationImport) {
        return true;
      }

      const isItImportedAsExternal =  resolvedConfigurationImport.getExternalValue();

      if (isItImportedAsExternal) {
        return true;
      }

      return resolvedConfigurationImport.imports.some(imported => beanParentConfiguration.importRegister.hasElement(imported));
    });
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
      compilationContext.report(new CanNotRegisterBeanError(
        null,
        bean.node,
        bean.parentConfiguration,
        application,
        missingDependencies,
      ));
    }
  });
};
