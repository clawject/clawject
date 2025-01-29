import { Bean } from '../bean/Bean';
import { CanNotRegisterBeanError } from '../../compilation-context/messages/errors/CanNotRegisterBeanError';
import { BeanKind } from '../bean/BeanKind';
import { Application } from '../application/Application';
import { DependencyResolver } from '../dependency-resolver/DependencyResolver';
import { Context } from '../../compilation-context/Context';
import {
  ResolvedDependency,
  ResolvedDependencyKind,
  UnresolvedDependency,
} from '../dependency-resolver/ResolvedDependency';
import { compact } from 'lodash';

export const buildDependencyGraphAndFillQualifiedBeans = (
  application: Application,
  beans: Bean[]
) => {
  for (const bean of beans) {
    if (Context.isCancellationRequested()) {
      return;
    }

    //Skipping beans that are embedded (not embedded parent)
    if (bean.embeddedParent !== null) {
      continue;
    }

    const beanCandidates = getBeanCandidates(bean, beans);
    const missingDependencies: UnresolvedDependency[] = [];
    const resolvedDependencies: ResolvedDependency[] = [];

    bean.dependencies.forEach((dependency) => {
      const result = DependencyResolver.resolveDependency(
        bean,
        dependency,
        beanCandidates,
        application
      );

      switch (result.kind) {
      case ResolvedDependencyKind.Unresolved: {
        missingDependencies.push(result);
        return;
      }
      case ResolvedDependencyKind.Bean: {
        application.dependencyGraph.addNodeWithEdges(bean, [result.target]);
        break;
      }
      case ResolvedDependencyKind.Map:
      case ResolvedDependencyKind.Set:
      case ResolvedDependencyKind.Array: {
        application.dependencyGraph.addNodeWithEdges(bean, result.target);
      }
      }

      resolvedDependencies.push(result);
    });
    //TODO report about missing dependencies for all cases

    if (missingDependencies.length > 0 && bean.kind === BeanKind.V2_CLASS) {
      Context.report(
        new CanNotRegisterBeanError(
          null,
          bean.node,
          bean.parentConfiguration,
          application,
          missingDependencies
        )
      );
    }

    application.resolvedBeanDependencies.set(
      bean,
      compact(resolvedDependencies)
    );
  }
};

function getBeanCandidates(bean: Bean, beans: Bean[]): Bean[] {
  const beanParentConfiguration = bean.parentConfiguration;

  if (bean.dependencies.size === 0) {
    return [];
  }

  return beans.filter((candidateBean) => {
    //Filtering out the bean itself
    if (candidateBean === bean) {
      return false;
    }

    //Filtering out beans that are embedded from the current bean
    if (candidateBean.embeddedParent === bean) {
      return false;
    }

    //Filtering out lifecycle beans
    if (candidateBean.isLifecycle()) {
      return false;
    }

    //Accepting all beans from the current configuration
    if (candidateBean.parentConfiguration === beanParentConfiguration) {
      return true;
    }

    //Declining all beans from other configurations that are internal
    return !candidateBean.isInternal();

    // TODO Maybe in future introduce hierarchical configuration imports
    // const parentConfiguration = candidateBean.parentConfiguration;
    // const resolvedConfigurationImport = application.resolvedImports.get(parentConfiguration);
    // if (!resolvedConfigurationImport) {
    //   return true;
    // }
    //
    // const isItImportedAsExternal = resolvedConfigurationImport.getExternalValue();
    // if (isItImportedAsExternal) {
    //   return true;
    // }
    //
    // return resolvedConfigurationImport.imports.some(imported => beanParentConfiguration.importRegister.hasElement(imported));
  });
}
