export enum BeanKind {
    /**
     * @Bean methodBean() {}
     * */
    METHOD = 'METHOD',

    /**
     * propertyBean = Bean(ClassConstructor)
     * */
    PROPERTY = 'PROPERTY',

    /**
     * @Bean arrowFunctionBean = (): any => {}
     * */
    ARROW_FUNCTION = 'ARROW_FUNCTION',

    /**
     * @Bean expression = 'someValue'
     * */
    EXPRESSION = 'EXPRESSION',

    /**
     * @PostConstruct @PreDestroy lifecycleMethod(): any {}
     * */
    LIFECYCLE_METHOD = 'LIFECYCLE_METHOD',

    /**
     * @PostConstruct @PreDestroy lifecycleArrowFunction = (): any => {}
     * */
    LIFECYCLE_ARROW_FUNCTION = 'LIFECYCLE_ARROW_FUNCTION',
}
