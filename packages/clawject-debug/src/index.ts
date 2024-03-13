import { Bean, ClawjectApplication, PostConstruct } from '@clawject/di';

class Foo {
  constructor(baz: Baz, someString: string) {}
}
class Bar {
  constructor(private quux: Quux) {}
}
class Baz {
  constructor(private bar: Bar) {}
}
class Quux {
  constructor(private baz: Baz) {}
}

@ClawjectApplication
class Application {
  @Bean string1 = 'string1';
  @Bean string2 = 'string2';

  foo = Bean(Foo);
  bar = Bean(Bar);
  baz = Bean(Baz);
  quux = Bean(Quux);

  @Bean
  beanThatReturnsVoid(): void {}
}
