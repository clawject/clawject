import { Configuration } from '../../configuration/Configuration';
import { Bean } from '../../bean/Bean';
import { Import } from '../../import/Import';
import { RuntimeConfigurationMetadata } from '../../../../runtime/metadata/RuntimeConfigurationMetadata';
import { LifecycleKind } from '../../../../runtime/LifecycleKind';
import { filterAndMap } from '../../utils/filterAndMap';
import { ApplicationBeanDependenciesMetadata, ApplicationBeanDependencyCollectionMetadata, ApplicationBeanDependencyMetadata, ApplicationBeanDependencyPlainMetadata, ApplicationBeanDependencyValueMetadata, ExportedBeanMetadata, RuntimeApplicationMetadata } from '../../../../runtime/metadata/RuntimeApplicationMetadata';
import { Application } from '../../application/Application';
import { compact } from 'lodash';
import { RuntimeBeanMetadata } from '../../../../runtime/metadata/MetadataTypes';
import { MaybeResolvedDependency } from '../../dependency-resolver/MaybeResolvedDependency';

export class RuntimeMetadataBuilder {

  static metadata(configuration: Configuration, application: Application | null): RuntimeConfigurationMetadata | RuntimeApplicationMetadata {
    const beans = Array.from(configuration.beanRegister.elements);
    const imports = Array.from(configuration.importRegister.elements);

    const runtimeConfigurationMetadata = this.configuration(configuration, beans, imports);
    const runtimeApplicationMetadata = application === null ? null : this.application(runtimeConfigurationMetadata, application);

    return runtimeApplicationMetadata ?? runtimeConfigurationMetadata;
  }

  private static configuration(configuration: Configuration, beans: Bean[], imports: Import[]): RuntimeConfigurationMetadata {
    return {
      className: configuration.className ?? '<anonymous>',
      lifecycle: {
        [LifecycleKind.POST_CONSTRUCT]: filterAndMap(beans, bean => bean.lifecycle.includes(LifecycleKind.POST_CONSTRUCT), bean => bean.classMemberName),
        [LifecycleKind.PRE_DESTROY]: filterAndMap(beans, bean => bean.lifecycle.includes(LifecycleKind.PRE_DESTROY), bean => bean.classMemberName)
      },
      imports: imports.map(it => ({classPropertyName: it.classMemberName})),
      beans: beans.reduce((acc, bean) => {
        acc[bean.classMemberName] = {
          scope: bean.scopeExpression.getAndDisposeSafe() as any,
          public: bean.public,
          lazy: bean.lazyExpression.getAndDisposeSafe() as any,
          kind: bean.kind,
          qualifiedName: bean.fullName,
        };

        return acc;
      }, {} as Record<string, RuntimeBeanMetadata>),
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

    const exportedBeansMetadata: ExportedBeanMetadata[] = [];
    application.exportedBeans.forEach((maybeResolvedDependency, name) => {
      const metadata = this.getDependencyMetadata(application, maybeResolvedDependency);

      if (metadata !== null) {
        exportedBeansMetadata.push({
          qualifiedName: name,
          metadata,
        });
      }
    });

    return {
      ...configurationMetadata,
      beanDependenciesMetadata,
      exportedBeansMetadata,
    };
  }

  private static getDependencyMetadata(application: Application, maybeResolvedDependency: MaybeResolvedDependency): ApplicationBeanDependencyMetadata | null {
    let kind: ApplicationBeanDependencyMetadata['kind'];
    if (maybeResolvedDependency.dependency.diType.isSet) {
      kind = 'set';
    } else if (maybeResolvedDependency.dependency.diType.isMap) {
      kind = 'map';
    } else if (maybeResolvedDependency.dependency.diType.isArray) {
      kind = 'array';
    } else if (maybeResolvedDependency.dependency.diType.isEmptyValue || maybeResolvedDependency.qualifiedBean === null && maybeResolvedDependency.qualifiedCollectionBeans === null) {
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

      if (maybeResolvedDependency.dependency.diType.isVoidUndefinedPlainUnionIntersection) {
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
