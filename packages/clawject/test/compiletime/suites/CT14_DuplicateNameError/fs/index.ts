import { Bean, CatContext, Qualifier } from '@clawject/di';

class MyContext extends CatContext {
  @Bean a = 42;
  @Bean @Qualifier('a') b = 43;

  @Bean c = 44;
  @Bean c = 45;
}
