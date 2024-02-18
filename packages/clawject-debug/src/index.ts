import { ClawjectApplication, Configuration, Import } from '@clawject/di';
@Configuration
class FooConfiguration {
  // ...
}

@Configuration
class BarConfiguration {
  fooConfiguration = Import(FooConfiguration);
}

@ClawjectApplication
class Application {
  fooConfiguration = Import(FooConfiguration);
  barConfiguration = Import(BarConfiguration);
}
