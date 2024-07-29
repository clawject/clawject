import { RuntimeConfigurationMetadata } from './RuntimeConfigurationMetadata';

export interface RuntimeApplicationMetadata extends RuntimeConfigurationMetadata {
  developmentId?: string;

  beanDependenciesMetadata: ApplicationBeanDependenciesMetadata[][];
  exposedBeansMetadata: ExposedBeanMetadata[];
}

export interface ExposedBeanMetadata {
  qualifiedName: string;
  metadata: ApplicationBeanDependencyMetadata;
}

export interface ApplicationBeanDependenciesMetadata {
  classPropertyName: string;
  dependencies: ApplicationBeanDependencyMetadata[];
}

export type ApplicationBeanDependencyMetadataKind = 'plain' | 'value' | 'set' | 'map' | 'array';

export interface ApplicationBeanDependencyMetadata {
  kind: ApplicationBeanDependencyMetadataKind;
}

export interface ApplicationBeanDependencyPlainMetadata extends ApplicationBeanDependencyMetadata {
  kind: 'plain';
  configurationIndex: number;
  classPropertyName: string;
  nestedProperty: string | null;
}

export interface ApplicationBeanDependencyValueMetadata extends ApplicationBeanDependencyMetadata {
  kind: 'value';
  value: any;
}

export interface ApplicationBeanDependencyCollectionMetadata extends ApplicationBeanDependencyMetadata {
  kind: 'set' | 'map' | 'array';
  metadata: Omit<ApplicationBeanDependencyPlainMetadata, 'kind'>[];
}
