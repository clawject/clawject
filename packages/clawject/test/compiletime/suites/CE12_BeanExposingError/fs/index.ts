import { Bean, ClawjectApplication, ExposeBeans } from '@clawject/di';

class IFoo {}
class Foo implements IFoo {}

@ClawjectApplication
class Application {
  foo = Bean(Foo);

  exposed1 = ExposeBeans<{ foo: Foo }>();
  exposed2 = ExposeBeans<{ foo: IFoo }>();
}
