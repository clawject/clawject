import { Bean, CatContext, ContainerManager, Embedded, Lazy, PostConstruct, Primary } from 'clawject';
import { IMyContext } from './IMyContext';

@Lazy(true)
class MyContext extends CatContext<IMyContext> {
  @Bean test1 = '';
  @Bean @Primary test2 = '';


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
