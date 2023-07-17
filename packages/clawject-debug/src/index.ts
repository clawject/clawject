import { Bean, CatContext, ContainerManager, PostConstruct } from 'clawject';
import { IMyContext } from './IMyContext';
import { ClassWithDependencies } from './ClassWithDependencies';

interface Test {
}

class A<T> {

}

class B implements A<string> {}
class C extends A<number> {}

class MyContext extends CatContext<IMyContext> {
  b = Bean(B);

  @PostConstruct test3(
    a: A<string>
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
