import { Bean, CatContext, ContainerManager } from 'clawject';

interface Test {
  foo: string;
}

// class A {
//   @Bean data = 123;
// }

export class MyContext extends CatContext<{}, number> {
  @Bean beanThatReturnsOne = (arg: 2) => 1 as const;
  @Bean beanThatReturnsTwo = (arg: 3) => 2 as const;
  @Bean beanThatReturnsThree = (arg: 1) => 3 as const;

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

ContainerManager.init(MyContext);
