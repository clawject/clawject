import { Configuration } from '../../configuration/Configuration';
import { Bean } from '../../bean/Bean';
import { Import } from '../../import/Import';
import { RuntimeConfigurationMetadata } from '../../../../runtime/metadata/RuntimeConfigurationMetadata';
import { LifecycleKind } from '../../../../runtime/LifecycleKind';
import { filterAndMap } from '../../utils/filterAndMap';
import { ApplicationBeanDependenciesMetadata, ApplicationBeanDependencyCollectionMetadata, ApplicationBeanDependencyMetadata, ApplicationBeanDependencyPlainMetadata, ApplicationBeanDependencyValueMetadata, RuntimeApplicationMetadata } from '../../../../runtime/metadata/RuntimeApplicationMetadata';
import { Application } from '../../application/Application';
import { compact } from 'lodash';
import { RuntimeBeanMetadata } from '../../../../runtime/metadata/MetadataTypes';

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
          kind: bean.kind
        };

        return acc;
      }, {} as Record<string, RuntimeBeanMetadata>),
      lazy: configuration.lazyExpression.getAndDisposeSafe() as any ?? false,
      scope: configuration.scopeExpression.getAndDisposeSafe() as any ?? 'singleton',
    };
  }

  private static application(configurationMetadata: RuntimeConfigurationMetadata, application: Application): RuntimeApplicationMetadata {
    let lastConfigurationIndex = 0;
    const configurationToIndex = new Map<Configuration, number>();
    const beanDependenciesMetadata: ApplicationBeanDependenciesMetadata[][] = [];

    application.forEachConfiguration((configuration) => {
      configurationToIndex.set(configuration, lastConfigurationIndex++);
    });

    application.forEachConfiguration((configuration) => {
      const beanDependencies: ApplicationBeanDependenciesMetadata[] = [];

      configuration.beanRegister.elements.forEach((bean) => {
        const resolvedDependencies = application.resolvedBeanDependencies.get(bean) ?? [];

        const beanDependencyMetadata: (ApplicationBeanDependencyMetadata | null)[] = resolvedDependencies.map((resolvedDependency) => {
          let kind: ApplicationBeanDependencyMetadata['kind'];
          if (resolvedDependency.dependency.diType.isSet) {
            kind = 'set';
          } else if (resolvedDependency.dependency.diType.isMap) {
            kind = 'map';
          } else if (resolvedDependency.dependency.diType.isArray) {
            kind = 'array';
          } else if (resolvedDependency.dependency.diType.isEmptyValue || resolvedDependency.qualifiedBean === null && resolvedDependency.qualifiedCollectionBeans === null) {
            kind = 'value';
          } else {
            kind = 'plain';
          }

          switch (kind) {
          case 'plain': {
            const qualifiedBean = resolvedDependency.qualifiedBean;

            if (!qualifiedBean) {
              return null;
            }

            const parentConfigurationIndex = configurationToIndex.get(qualifiedBean.parentConfiguration);
            if (parentConfigurationIndex === undefined) {
              return null;
            }

            const metadata: ApplicationBeanDependencyPlainMetadata = {
              kind,
              configurationIndex: parentConfigurationIndex,
              classPropertyName: qualifiedBean.classMemberName,
              nestedProperty: qualifiedBean.nestedProperty,
            };

            return metadata;
          }
          case 'set':
          case 'array':
          case 'map': {
            const qualifiedCollectionBeans = resolvedDependency.qualifiedCollectionBeans;

            if (!qualifiedCollectionBeans) {
              return null;
            }

            const metadata: ApplicationBeanDependencyCollectionMetadata = {
              kind,
              metadata: compact(qualifiedCollectionBeans.map((qualifiedBean) => {
                const parentConfigurationIndex = configurationToIndex.get(qualifiedBean.parentConfiguration);

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

            if (resolvedDependency.dependency.diType.isVoidUndefinedPlainUnionIntersection) {
              value = undefined;
            }

            const metadata: ApplicationBeanDependencyValueMetadata = {
              kind,
              value,
            };
            return metadata;
          }
          }
        });

        beanDependencies.push({
          classPropertyName: bean.classMemberName,
          dependencies: compact(beanDependencyMetadata),
        });
      });

      beanDependenciesMetadata.push(beanDependencies);
    });

    return {
      ...configurationMetadata,
      beanDependenciesMetadata,
    };
  }
}
