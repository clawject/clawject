import { Bean, CatContext, ContainerManager, PostConstruct, Primary } from 'clawject';
import { IMyContext } from './IMyContext';

interface IA<D, V> {}
class A<D, V> {}

class B<T> extends A<T, number> implements IA<T, boolean> {}

class MyContext extends CatContext<IMyContext> {
  b = Bean(B<number>);

  @PostConstruct
  pc(
    test: IA<number, boolean>,
  ) {

  }

  // @PostConstruct bb(a: A<string>) {
  //
  // }
  //
  // @Bean test0(
  //   test1: any,
  // ): any {
  //   return null;
  // }
  //
  // @Bean test1(
  //   test0: any,
  // ): any {
  //   return null;
  // }
  //
  // @Bean number = 123;
  // @Bean number2 = 123;
  //
  // @Bean data = 'data';
  // classWithDependencies = Bean(ClassWithDependencies);
  //
  // @PostConstruct
  // postConstruct(
  //   data: number
  // ) {
  //   console.log(123);
  // }
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
