import { RuntimeConfigurationMetadata } from './RuntimeConfigurationMetadata';

export interface RuntimeApplicationMetadata extends RuntimeConfigurationMetadata {
  beanDependenciesMetadata: ApplicationBeanDependenciesMetadata[][];
}

export interface ApplicationBeanDependenciesMetadata {
  classPropertyName: string;
  dependencies: ApplicationBeanDependencyMetadata[];
}

export interface ApplicationBeanDependencyMetadata {
  kind: 'plain' | 'value' | 'set' | 'map' | 'array';
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
