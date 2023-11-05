import { Bean, CatContext, PostConstruct, PreDestroy } from 'clawject';

class Class {
  constructor(
    num: number,
    str: string,
    sym: symbol,
  ) {}
}

export class MyContext extends CatContext {
  @Bean str0 = 'str0';
  @Bean str1 = 'str1';

  beanFunction = Bean(Class);

  @Bean
  beanDecorator(
    num: number,
    str: string,
    sym: symbol,
  ): any {}
  @PostConstruct
  postConstruct(
    num: number,
    str: string,
    sym: symbol,
  ) {}
  @PreDestroy
  preDestroy(
    num: number,
    str: string,
    sym: symbol,
  ) {}
}
