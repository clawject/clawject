import { Bean, ClawjectApplication, PostConstruct, PreDestroy } from '@clawject/di';

class Class {
  constructor(
    num: number,
    str: string,
    sym: symbol,
  ) {}
}

class ClassWithNever {
  constructor(
    nev: never,
    nevComputed: string & number,
  ) {}
}

@ClawjectApplication
class Aplication {
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
    nev: never,
    nevComputed: string & number,
  ) {}
  @PreDestroy
  preDestroy(
    num: number,
    str: string,
    sym: symbol,
    nev: never,
    nevComputed: string & number,
  ) {}
}

@ClawjectApplication
class ApplicationNever {
  classWithNever = Bean(ClassWithNever)

  @PreDestroy
  preDestroy(
    nev: never,
    nevComputed: string & number,
  ) {}
}
