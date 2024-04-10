import { Bean, ClawjectApplication, PostConstruct, PreDestroy } from '@clawject/di';

@ClawjectApplication
class Application {
  @Bean num: number;
  @PostConstruct postConstruct(): void;
  @PreDestroy preDestroy(): void;
}
