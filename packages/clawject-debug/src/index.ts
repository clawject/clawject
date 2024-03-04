import { Bean, ClawjectApplication, PostConstruct } from '@clawject/di';

@ClawjectApplication
class Application {
  @Bean data = 1 as const;

  @PostConstruct
  init(
    data: 1
  ) {
    console.log('init');
  }
}
