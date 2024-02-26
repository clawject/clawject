import { Configuration } from '../../configuration/Configuration';
import { RuntimeConfigurationMetadata } from '../../../../runtime/metadata/RuntimeConfigurationMetadata';
import { LifecycleKind } from '../../../../runtime/types/LifecycleKind';
import { ApplicationBeanDependenciesMetadata, ApplicationBeanDependencyCollectionMetadata, ApplicationBeanDependencyMetadata, ApplicationBeanDependencyPlainMetadata, ApplicationBeanDependencyValueMetadata, ExposedBeanMetadata, RuntimeApplicationMetadata } from '../../../../runtime/metadata/RuntimeApplicationMetadata';
import { Application } from '../../application/Application';
import { compact } from 'lodash';
import { MaybeResolvedDependency } from '../../dependency-resolver/MaybeResolvedDependency';

export class RuntimeMetadataBuilder {

  static metadata(configuration: Configuration, application: Application | null): RuntimeConfigurationMetadata | RuntimeApplicationMetadata {
    const runtimeConfigurationMetadata = this.configuration(configuration);
    const runtimeApplicationMetadata = application === null ? null : this.application(runtimeConfigurationMetadata, application);

    return runtimeApplicationMetadata ?? runtimeConfigurationMetadata;
  }

  private static configuration(configuration: Configuration): RuntimeConfigurationMetadata {
    const beans = configuration.beanRegister.elements;
    const imports = configuration.importRegister.elements;

    const lifecycleMetadata: RuntimeConfigurationMetadata['lifecycle'] = {
      [LifecycleKind.POST_CONSTRUCT]: [],
      [LifecycleKind.PRE_DESTROY]: [],
    };
    const importsMetadata: RuntimeConfigurationMetadata['imports'] = [];
    const beansMetadata: RuntimeConfigurationMetadata['beans'] = {};

    beans.forEach(bean => {
      if (bean.nestedProperty !== null) {
        return;
      }

      if (bean.lifecycle.includes(LifecycleKind.POST_CONSTRUCT)) {
        lifecycleMetadata[LifecycleKind.POST_CONSTRUCT].push(bean.classMemberName);
      }

      if (bean.lifecycle.includes(LifecycleKind.PRE_DESTROY)) {
        lifecycleMetadata[LifecycleKind.PRE_DESTROY].push(bean.classMemberName);
      }

      beansMetadata[bean.classMemberName] = {
        scope: bean.scopeExpression.getAndDisposeSafe() as any,
        lazy: bean.lazyExpression.getAndDisposeSafe() as any,
        kind: bean.kind,
        qualifiedName: bean.fullName,
      };
    });

    imports.forEach(it => {
      importsMetadata.push({classPropertyName: it.classMemberName});
    });

    return {
      className: configuration.className ?? '<anonymous>',
      lifecycle: lifecycleMetadata,
      imports: importsMetadata,
      beans: beansMetadata,
      lazy: configuration.lazyExpression.getAndDisposeSafe() as any ?? false,
      scope: configuration.scopeExpression.getAndDisposeSafe() as any ?? 'singleton',
    };
  }

  private static application(configurationMetadata: RuntimeConfigurationMetadata, application: Application): RuntimeApplicationMetadata {
    const beanDependenciesMetadata: ApplicationBeanDependenciesMetadata[][] = [];

    application.forEachConfiguration((configuration) => {
      const beanDependencies: ApplicationBeanDependenciesMetadata[] = [];

      configuration.beanRegister.elements.forEach((bean) => {
        const resolvedDependencies = application.resolvedBeanDependencies.get(bean) ?? [];

        const beanDependencyMetadata: (ApplicationBeanDependencyMetadata | null)[] = resolvedDependencies.map((resolvedDependency) => {
          return this.getDependencyMetadata(application, resolvedDependency);
        });

        beanDependencies.push({
          classPropertyName: bean.classMemberName,
          dependencies: compact(beanDependencyMetadata),
        });
      });

      beanDependenciesMetadata.push(beanDependencies);
    });

    const exposedBeansMetadata: ExposedBeanMetadata[] = [];
    application.exposedBeans.forEach((maybeResolvedDependency, name) => {
      const metadata = this.getDependencyMetadata(application, maybeResolvedDependency);

      if (metadata !== null) {
        exposedBeansMetadata.push({
          qualifiedName: name,
          metadata,
        });
      }
    });

    return {
      ...configurationMetadata,
      beanDependenciesMetadata,
      exposedBeansMetadata,
    };
  }

  private static getDependencyMetadata(application: Application, maybeResolvedDependency: MaybeResolvedDependency): ApplicationBeanDependencyMetadata | null {
    let kind: ApplicationBeanDependencyMetadata['kind'];
    if (maybeResolvedDependency.dependency.cType.isSet()) {
      kind = 'set';
    } else if (maybeResolvedDependency.dependency.cType.isMap()) {
      kind = 'map';
    } else if (maybeResolvedDependency.dependency.cType.isArray()) {
      kind = 'array';
    } else if (maybeResolvedDependency.dependency.cType.isEmptyValue() || maybeResolvedDependency.qualifiedBean === null && maybeResolvedDependency.qualifiedCollectionBeans === null) {
      kind = 'value';
    } else {
      kind = 'plain';
    }

    switch (kind) {
    case 'plain':
      return this.getForPlainMetadata(application, maybeResolvedDependency);
    case 'set':
    case 'array':
    case 'map': {
      const qualifiedCollectionBeans = maybeResolvedDependency.qualifiedCollectionBeans;
      const qualifiedBean = maybeResolvedDependency.qualifiedBean;

      if (!qualifiedCollectionBeans) {
        if (qualifiedBean) {
          return this.getForPlainMetadata(application, maybeResolvedDependency);
        }

        return null;
      }

      const metadata: ApplicationBeanDependencyCollectionMetadata = {
        kind,
        metadata: compact(qualifiedCollectionBeans.map((qualifiedBean) => {
          const parentConfigurationIndex = application.getConfigurationIndexUnsafe(qualifiedBean.parentConfiguration);

          if (parentConfigurationIndex === undefined) {
            return null;
          }

          const metadata: ApplicationBeanDependencyCollectionMetadata['metadata'][0] = {
            configurationIndex: parentConfigurationIndex,
            classPropertyName: qualifiedBean.classMemberName,
            nestedProperty: qualifiedBean.nestedProperty,
          };

          return metadata;
        })),
      };

      return metadata;
    }

    case 'value': {
      let value: any = null;

      if (maybeResolvedDependency.dependency.cType.isVoidLike()) {
        value = undefined;
      }

      const metadata: ApplicationBeanDependencyValueMetadata = {
        kind,
        value,
      };
      return metadata;
    }
    }
  }

  private static getForPlainMetadata(application: Application, maybeResolvedDependency: MaybeResolvedDependency): ApplicationBeanDependencyPlainMetadata | null {
    const qualifiedBean = maybeResolvedDependency.qualifiedBean;

    if (!qualifiedBean) {
      return null;
    }

    const parentConfigurationIndex = application.getConfigurationIndexUnsafe(qualifiedBean.parentConfiguration);
    if (parentConfigurationIndex === undefined) {
      return null;
    }

    return {
      kind: 'plain',
      configurationIndex: parentConfigurationIndex,
      classPropertyName: qualifiedBean.classMemberName,
      nestedProperty: qualifiedBean.nestedProperty,
    };
  }
}
