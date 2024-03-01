import { Bean, ClawjectApplication, PostConstruct } from '@clawject/di';

@ClawjectApplication
class Application {
  @Bean data = 1;

  @PostConstruct
  init(
    data: string
  ) {
    console.log('init');
  }
}
