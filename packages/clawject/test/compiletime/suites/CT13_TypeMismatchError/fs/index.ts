import { Bean, CatContext } from '@clawject/di';

interface IMyContext {
  a: string;
}

class MyContext extends CatContext<IMyContext> {
  @Bean a = 42;
}
