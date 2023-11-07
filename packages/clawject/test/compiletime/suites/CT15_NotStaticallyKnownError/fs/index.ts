import { Bean, CatContext, Qualifier } from 'clawject';

const BeanName = 'a';
const UniqSymbol = Symbol.for('UniqSymbol');

class MyContextWithPropertyNames extends CatContext {
  @Bean ['computed' + 'property'] = 'a';
  @Bean [BeanName] = 'b';
  @Bean [UniqSymbol] = 'c';
}

class MyContextWithQualifier extends CatContext {
  @Bean @Qualifier('computed' + 'qualifier') d = 'd';
}
