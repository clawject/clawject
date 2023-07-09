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
}

export const DecoratorKinds = new Set(Object.values(DecoratorKind));
