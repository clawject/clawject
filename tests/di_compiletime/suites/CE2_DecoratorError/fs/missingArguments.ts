import { Bean, ClawjectApplication, Qualifier, Scope } from '@clawject/di';

@ClawjectApplication
class Application {
  @Bean @Scope() foo = 42;
  @Bean @Qualifier() bar = 42;
}
