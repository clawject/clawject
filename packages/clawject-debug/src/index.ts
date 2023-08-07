import {
  Bean,
  CatContext,
  ContainerManager,
  Embedded,
  Lazy,
  PostConstruct,
  PreDestroy,
  Primary,
  Qualifier,
  Configuration,
  Component,
  Autowired,
  Scope
} from 'clawject';


interface Test {
  foo: string;
}

class A {
  @Bean @Component() data = 123;
}

export class MyContext extends CatContext {
  @Bean test1: Test = { foo: '123' };
  @Bean test2: Test = { foo: '1234' };

  @PostConstruct
  postConstruct(
    test2: Test,
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
