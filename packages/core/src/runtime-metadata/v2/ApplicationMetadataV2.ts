import { ResolvedDependencyKind } from '../../core/dependency-resolver/ResolvedDependency';
import { BeanKind } from '../../core/bean/BeanKind';

export type ApplicationMetadataV2 = {
  rootConfigurationSymbol: symbol;

  /**
   * Configuration symbol to configuration symbols that are importing this configuration.
   * */
  configurationImporters: Map<symbol, symbol[]>;

  /**
   * Configuration symbol to bean symbols that are defined in this configuration.
   * */
  configurationBeanSymbols: Map<symbol, symbol[]>;

  /**
   * Configuration symbol to import symbols that are imported by this configuration.
   * */
  configurationImportSymbols: Map<symbol, symbol[]>;

  /**
   * Import symbol to import metadata.
   */
  importSymbolToMetadata: Map<symbol, ImportMetadata>;

  /**
   * Bean symbol to property name inside configuration class instance mapping.
   * */
  beanSymbolToMetadata: Map<symbol, BeanMetadata>;

  /**
   * Bean symbol to its dependencies.
   * */
  beanDependencies: Map<symbol, BeanDependencyMetadata[]>;
};

export type BeanDependencyMetadata =
  | [kind: ResolvedDependencyKind.ApplicationRef]
  | [
      kind:
        | ResolvedDependencyKind.Bean
        | ResolvedDependencyKind.Lazy
        | ResolvedDependencyKind.ConfigurationRef
        | ResolvedDependencyKind.LazyConfigurationLoader,
      target: symbol
    ]
  | [
      kind:
        | ResolvedDependencyKind.Map
        | ResolvedDependencyKind.Set
        | ResolvedDependencyKind.Array,
      target: symbol[]
    ];

export type BeanKindMetadata =
  | BeanKind.V2_CLASS
  | BeanKind.V2_FACTORY
  | BeanKind.V2_VALUE
  | BeanKind.V2_LIFECYCLE;

export type BeanPropertyMetadata =
  | [name: string]
  | [embeddedParent: symbol, nestedProperty: string];

export type BeanMetadata = [
  property: BeanPropertyMetadata,
  kind: BeanKindMetadata,
  configurationSymbol: symbol,
];

export type ImportMetadata = [
  property: string,
  targetConfiguration: symbol,
  callable: boolean
];
