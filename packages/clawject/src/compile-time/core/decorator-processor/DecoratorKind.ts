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
  Conditional = 'Conditional',
  ComponentScan = 'ComponentScan',
  Imports = 'Imports',
  ClawjectApplication = 'ClawjectApplication',
}

export const DecoratorKinds = new Set(Object.values(DecoratorKind));
