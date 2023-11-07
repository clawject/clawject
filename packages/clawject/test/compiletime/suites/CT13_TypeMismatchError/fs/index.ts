import { Bean, CatContext } from 'clawject';

interface IMyContext {
  a: string;
}

class MyContext extends CatContext<IMyContext> {
  @Bean a = 42;
}
