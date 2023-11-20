export enum BeanKind {
  /**
   * @Bean factoryMethod() {}
   * */
  FACTORY_METHOD = 'FACTORY_METHOD',

  /**
   * classConstructor = Bean(ClassConstructor)
   * */
  CLASS_CONSTRUCTOR = 'CLASS_CONSTRUCTOR',

  /**
   * @Bean factoryArrowFunction = (): any => {}
   * */
  FACTORY_ARROW_FUNCTION = 'FACTORY_ARROW_FUNCTION',

  /**
   * @Bean valueExpression = 'someValue'
   * @Bean get valueExpression(): number { return 123 }
   * */
  VALUE_EXPRESSION = 'VALUE_EXPRESSION',

  /**
   * @PostConstruct @PreDestroy lifecycleMethod(): any {}
   * */
  LIFECYCLE_METHOD = 'LIFECYCLE_METHOD',

  /**
   * @PostConstruct @PreDestroy lifecycleArrowFunction = (): any => {}
   * */
  LIFECYCLE_ARROW_FUNCTION = 'LIFECYCLE_ARROW_FUNCTION',
}
