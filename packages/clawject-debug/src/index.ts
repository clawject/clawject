import { Bean, CatContext, ContainerManager, Embedded, Lazy, PostConstruct, PreDestroy, Primary, Qualifier } from 'clawject';

interface Test {
  foo: string;
}

class MyContext extends CatContext {
  @Bean @Qualifier('_123') test1: Test = { foo: '123' };
  @Bean @Qualifier('test4') test2: Test = { foo: '123' };

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
