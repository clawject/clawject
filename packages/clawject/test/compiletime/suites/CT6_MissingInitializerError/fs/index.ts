import { Bean, CatContext, PostConstruct, PreDestroy } from '@clawject/di';

export class MyContext extends CatContext {
  @Bean num: number;
  @PostConstruct postConstruct(): void;
  @PreDestroy preDestroy(): void;
}
