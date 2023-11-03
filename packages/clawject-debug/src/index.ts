import { Bean, CatContext, ContainerManager, PostConstruct } from 'clawject';

interface ITest {
  a: string;
}

class Test implements ITest {
  a = 'a';
}

export class MyContext extends CatContext {
  test = Bean(Test);

  @PostConstruct
  init(
    dep0: Test
  ) {
    console.log(dep0.a);
  }
}

console.log(ContainerManager.init(MyContext));
