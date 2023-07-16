import { Bean, CatContext, ContainerManager, PostConstruct } from 'clawject';
import { IMyContext } from './IMyContext';
import { ClassWithDependencies } from './ClassWithDependencies';

interface Test {
}

class MyContext extends CatContext<IMyContext> {
  @Bean test0(
    test1: any,
  ): any {
    return null;
  }

  @Bean test1(
    test0: any,
  ): any {
    return null;
  }

  @Bean data = 'data';
  classWithDependencies = Bean(ClassWithDependencies);

  @PostConstruct
  postConstruct(
    data: number
  ) {
    console.log(123);
  }
}

class MyTest2 extends CatContext {
  classWithDependencies = Bean(ClassWithDependencies);
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
