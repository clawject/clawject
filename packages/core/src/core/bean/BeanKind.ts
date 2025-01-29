export const enum BeanKind {
  /**
   * @Bean factoryMethod() {}
   * */
  FACTORY_METHOD = 1,

  /**
   * classConstructor = Bean(ClassConstructor)
   * */
  CLASS_CONSTRUCTOR = 2,

  /**
   * @Bean factoryArrowFunction = (): any => {}
   * */
  FACTORY_ARROW_FUNCTION = 3,

  /**
   * @Bean valueExpression = 'someValue'
   * @Bean get valueExpression(): number { return 123 }
   * */
  VALUE_EXPRESSION = 4,

  /**
   * @PostConstruct @PreDestroy lifecycleMethod(): any {}
   * */
  LIFECYCLE_METHOD = 5,

  /**
   * @PostConstruct @PreDestroy lifecycleArrowFunction = (): any => {}
   * */
  LIFECYCLE_ARROW_FUNCTION = 6,

  V2_CLASS = 7,
  V2_FACTORY = 8,
  V2_VALUE = 9,
  V2_LIFECYCLE = 10,
}
