import { Bean, ClawjectApplication, PostConstruct } from '@clawject/di';

@ClawjectApplication
class Application {
  @Bean someSymbol = Symbol('someSymbol');

  @PostConstruct
  postConstruct(symbol: typeof this.someSymbol) {
    console.log('Application started');
  }
}
