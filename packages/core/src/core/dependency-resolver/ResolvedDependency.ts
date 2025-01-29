import { Bean } from '../bean/Bean';
import { Configuration } from '../configuration/Configuration';
import { Dependency } from '../dependency/Dependency';

export type UnresolvedDependency = { kind: ResolvedDependencyKind.Unresolved, relatedDependency: Dependency; injectionCandidates: Bean[]; };
export type ResolvedBeanDependency = { kind: ResolvedDependencyKind.Bean | ResolvedDependencyKind.Lazy; target: Bean; };
export type ResolvedApplicationRefDependency = { kind: ResolvedDependencyKind.ApplicationRef; };
export type ResolvedConfigurationRefDependency = { kind: ResolvedDependencyKind.ConfigurationRef; target: Configuration; };
export type ResolvedLazyConfigurationLoaderDependency = { kind: ResolvedDependencyKind.LazyConfigurationLoader; target: Configuration; };
export type ResolvedCollectionDependency = {
  kind:
    | ResolvedDependencyKind.Map
    | ResolvedDependencyKind.Set
    | ResolvedDependencyKind.Array;
  target: Bean[];
};

export type MaybeResolvedDependency = UnresolvedDependency | ResolvedDependency;

export type ResolvedDependency =
  | ResolvedBeanDependency
  | ResolvedApplicationRefDependency
  | ResolvedConfigurationRefDependency
  | ResolvedLazyConfigurationLoaderDependency
  | ResolvedCollectionDependency;

//Negative values are reserved for special cases
export enum ResolvedDependencyKind {
  Unresolved = -9999999,
  LazyConfigurationLoader = -4,
  Lazy = -3,
  ConfigurationRef = -2,
  ApplicationRef = -1,

  Bean = 0,
  Map = 1,
  Set = 2,
  Array = 3,
}
