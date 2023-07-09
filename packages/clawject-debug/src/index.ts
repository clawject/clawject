import { Bean, CatContext, ContainerManager, Embedded, Lazy, PostConstruct } from 'clawject';
import { IMyContext } from './IMyContext';

class A {
    data: string = '';
    data2: number = 42;
}

@Lazy(true)
class MyContext extends CatContext<IMyContext> {
  @Embedded a = Bean(A);

  @PostConstruct
  postConstruct(
      data: string,
  ) {

  }
}

console.log(Array.from(ContainerManager.init(MyContext).getAllBeans()));

// class Bar {
//     constructor(
//         private foo: Foo,
//     ) {}
// }
//
// class Foo {
//     constructor(
//         private bar: Bar,
//     ) {}
// }
//
// class MyContext2 extends CatContext {
//     foo = Bean(Foo);
//     bar = Bean(Bar);
// }
