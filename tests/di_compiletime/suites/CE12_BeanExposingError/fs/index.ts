import { Bean, ClawjectApplication, ExposeBeans } from '@clawject/di';

class IFoo {}
class Foo implements IFoo {}

interface Exposed3 {
  str: string;
  num: number;
}

@ClawjectApplication
class Application {
  foo = Bean(Foo);

  @Bean num1 = 1;
  @Bean num2 = 2;

  exposed1 = ExposeBeans<{ foo: Foo }>();
  exposed2 = ExposeBeans<{ foo: IFoo }>();
  exposed3 = ExposeBeans<Exposed3>();
}
