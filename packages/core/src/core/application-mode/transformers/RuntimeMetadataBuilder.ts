import { Configuration } from '../../configuration/Configuration';
import { Application } from '../../application/Application';
import { compact } from 'lodash';
import { MaybeResolvedDependency } from '../../dependency-resolver/MaybeResolvedDependency';
import { RuntimeConfigurationMetadata } from '../../../runtime-metadata/RuntimeConfigurationMetadata';
import { ApplicationBeanDependenciesMetadata, ApplicationBeanDependencyCollectionMetadata, ApplicationBeanDependencyMetadata, ApplicationBeanDependencyPlainMetadata, ApplicationBeanDependencyValueMetadata, ExposedBeanMetadata, RuntimeApplicationMetadata, RuntimeDevelopmentApplicationMetadata } from '../../../runtime-metadata/RuntimeApplicationMetadata';
import { ConfigLoader } from '../../../config/ConfigLoader';

export class RuntimeMetadataBuilder {

  static metadata(configuration: Configuration, application: null): RuntimeConfigurationMetadata;
  static metadata(configuration: Configuration, application: Application): RuntimeApplicationMetadata;
  static metadata(configuration: Configuration, application: Application | null): RuntimeConfigurationMetadata | RuntimeApplicationMetadata;
  static metadata(configuration: Configuration, application: Application | null): RuntimeConfigurationMetadata | RuntimeApplicationMetadata {
    return {} as any;
  }

  static developmentApplicationMetadata(configuration: Configuration, application: Application): RuntimeDevelopmentApplicationMetadata {
    const metadata = this.metadata(configuration, application);

    return {
      beanDependenciesMetadata: metadata.beanDependenciesMetadata,
      exposedBeansMetadata: metadata.exposedBeansMetadata,
    };
  }
  private static application(configurationMetadata: RuntimeConfigurationMetadata, application: Application): RuntimeApplicationMetadata {
    const beanDependenciesMetadata: ApplicationBeanDependenciesMetadata[][] = [];

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

    const metadata: RuntimeApplicationMetadata = {
      ...configurationMetadata,
      beanDependenciesMetadata,
      exposedBeansMetadata,
    };

    if (ConfigLoader.get().mode === 'development') {
      metadata.developmentId = application.id;
    }

    return metadata;
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
      throw new Error('Not implemented');
    }

    case 'value': {
      let value: any = null;

      if (maybeResolvedDependency.dependency.cType.isOptionalUndefined()) {
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

    const parentConfigurationIndex: number | null = null;
    if (parentConfigurationIndex === null) {
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
