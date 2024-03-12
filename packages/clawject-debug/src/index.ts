import { Bean, ClawjectApplication, PostConstruct } from '@clawject/di';

@ClawjectApplication
class Application {
  @Bean data: Record<string, any> = {};

  @PostConstruct
  postConstruct(
    a: Record<string, string>
  ) {

  }
}
