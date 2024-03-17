import { Bean, ClawjectApplication, ExposeBeans, Scope } from '@clawject/di';

class Foo {
  static instantiationsCount = 0;

  instantiationCount: number;

  constructor() {
    this.instantiationCount = ++Foo.instantiationsCount;
  }
}

@ClawjectApplication
class Application {
  fooSingleton = Bean(Foo);
  @Scope('singleton') fooSingletonExplicit = Bean(Foo);
  @Scope('transient') fooTransient1 = Bean(Foo);
  @Scope('transient') fooTransient2 = Bean(Foo);

  exposed = ExposeBeans<{
    fooSingleton: Foo,
    fooSingletonExplicit: Foo,
    fooTransient1: Foo,
    fooTransient2: Foo,
  }>();
}
