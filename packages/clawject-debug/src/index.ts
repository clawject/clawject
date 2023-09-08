import { Bean, CatContext, ContainerManager } from 'clawject';
import { IMyContext } from './IMyContext';

interface Test {
  foo: string;
}

// class A {
//   @Bean data = 123;
// }

export class MyContext extends CatContext {
  @Bean beanThatReturnsOne = (arg: 2) => 1 as const;
  @Bean beanThatReturnsTwo = (arg: 3) => 2 as const;
  @Bean beanThatReturnsThree = (arg: 1) => 3 as const;

  @Bean data = 1;
  @Bean data2 = 1;

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

console.log(typeof ContainerManager.init(MyContext).getBeans());
