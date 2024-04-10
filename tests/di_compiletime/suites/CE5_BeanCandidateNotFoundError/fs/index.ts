import { Bean, ClawjectApplication, PostConstruct, PreDestroy } from '@clawject/di';

class Class {
  constructor(
    num: number,
    str: string,
    sym: symbol,
  ) {}
}

@ClawjectApplication
export class Aplication {
  @Bean str0 = 'str0';
  @Bean str1 = 'str1';

  beanFunction = Bean(Class);

  @Bean
  beanDecorator(
    num: number,
    str: string,
    sym: symbol,
  ): Class { return new Class(num, str, sym) }
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
