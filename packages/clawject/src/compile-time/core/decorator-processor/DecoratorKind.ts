export enum DecoratorKind {
  Autowired = 'Autowired',
  Bean = 'Bean',
  PreDestroy = 'PreDestroy',
  Component = 'Component',
  Configuration = 'Configuration',
  Embedded = 'Embedded',
  Lazy = 'Lazy',
  PostConstruct = 'PostConstruct',
  Scope = 'Scope',
  Primary = 'Primary',
  Qualifier = 'Qualifier',
  ComponentScan = 'ComponentScan',
  Import = 'Import',
}

export const DecoratorKinds = new Set(Object.values(DecoratorKind));
