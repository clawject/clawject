import {Bean, ClawjectApplication} from '@clawject/di';

class Foo {
  constructor(
    private bar: Bar,
  ) {}
}

class Bar {
  constructor(
    private baz: Baz,
  ) {}
}

class Baz {
  constructor(
    private foo: Foo,
  ) {}
}

@ClawjectApplication
class Application {
  foo = Bean(Foo);
  bar = Bean(Bar);
  baz = Bean(Baz);
}
