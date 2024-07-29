import { Bean, Configuration } from '@clawject/di';

const BeanName = 'a';
const UniqSymbol = Symbol.for('UniqSymbol');

@Configuration
class MyConfiguration {
  @Bean ['computed' + 'property'] = 'a';
  @Bean [BeanName] = 'b';
  @Bean [UniqSymbol] = 'c';
}
