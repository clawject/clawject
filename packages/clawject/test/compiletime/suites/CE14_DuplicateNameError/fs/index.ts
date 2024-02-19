import { Bean, ClawjectApplication, Qualifier } from '@clawject/di';

@ClawjectApplication
class Application {
  @Bean a = 42;
  @Bean @Qualifier('a') b = 43;

  @Bean c = 44;
  @Bean c = 45;
}
