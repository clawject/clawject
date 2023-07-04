export enum DecoratorKind {
    Autowired = 'Autowired',
    Bean = 'Bean',
    BeforeDestruct = 'BeforeDestruct',
    Component = 'Component',
    Configuration = 'Configuration',
    EmbeddedBean = 'EmbeddedBean',
    Lazy = 'Lazy',
    PostConstruct = 'PostConstruct',
    Scope = 'Scope',
}

export const DecoratorKinds = new Set(Object.values(DecoratorKind));
