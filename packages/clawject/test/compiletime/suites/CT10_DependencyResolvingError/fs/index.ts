import { Bean, CatContext } from 'clawject';

class MyContext extends CatContext {
  a = Bean();
  b = Bean(42);
  c = Bean('42');
  d = Bean(D);
}
