import { Bean, CatContext } from 'clawject';

class A {}
class B {}

interface IMyContext {
  a: A;
  b: B;
  c: number;
  d: string;
}

class MyContext extends CatContext<IMyContext> {
  a = Bean(A);
}
