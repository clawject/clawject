import { Bean, ClawjectApplication, Qualifier } from '@clawject/di';

@ClawjectApplication
class Application {
  @Bean @Qualifier('computed' + 'qualifier') foo = 42;
}
