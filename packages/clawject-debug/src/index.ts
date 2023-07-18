import { Bean, CatContext, ContainerManager, PostConstruct, Primary } from 'clawject';
import { IMyContext } from './IMyContext';

class B<T> {}

interface IA<T, V> extends B<number> {}

class A<T> extends B<T> implements IA<T, boolean> {}

class MyContext extends CatContext<IMyContext> {
  a = Bean(A<boolean>);

  @PostConstruct p(
    test: A<boolean>
  ) {

  }

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
