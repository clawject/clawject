import { Bean, ClawjectApplication, Configuration, Qualifier } from '@clawject/di';

const BeanName = 'a';
const UniqSymbol = Symbol.for('UniqSymbol');

@Configuration
class MyConfiguration {
  @Bean ['computed' + 'property'] = 'a';
  @Bean [BeanName] = 'b';
  @Bean [UniqSymbol] = 'c';
}

@ClawjectApplication
class Application {
  @Bean @Qualifier('computed' + 'qualifier') d = 'd';
}
