export enum DecoratorKind {
  Bean = 'Bean',
  PreDestroy = 'PreDestroy',
  Configuration = 'Configuration',
  Embedded = 'Embedded',
  Lazy = 'Lazy',
  PostConstruct = 'PostConstruct',
  Scope = 'Scope',
  Primary = 'Primary',
  Qualifier = 'Qualifier',
  Conditional = 'Conditional',
  ClawjectApplication = 'ClawjectApplication',
  Internal = 'Internal',
  External = 'External',
  Dynamic = 'Dynamic',
}

export const DecoratorKinds = new Set(Object.values(DecoratorKind));
