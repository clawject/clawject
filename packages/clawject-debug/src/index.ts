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
  Autowired
} from 'clawject';

interface Test<T> {

}

// @Component
// class MyComponent<T extends string> {
//   constructor(
//     data: T,
//   ) {}
// }

class MyContext extends CatContext {
  @Bean data = (number: number) => 'data';

  @Bean test = 123;
}

class ImplicitComponent {
  @PostConstruct
  method() {}
}

@Configuration
export class MyConfiguration {
  @Bean
  methodBean(
    data: string,
    postData: number,
  ): number { return  123; }


  @Autowired
    element!: string;
}

// export class MyContext extends CatContext {
//   @Bean test1: Test = { foo: '123' };
//   @Bean test2: Test = { foo: '1234' };
//
//   @PostConstruct
//   postConstruct() {
//
//   }
//
//   // @Bean test0(
//   //   test1: any,
//   // ): any {
//   //   return null;
//   // }
//   //
//   // @Bean test1(
//   //   test0: any,
//   // ): any {
//   //   return null;
//   // }
//   //
//   // @Bean number = 123;
//   // @Bean number2 = 123;
//   //
//   // @Bean data = 'data';
//   // classWithDependencies = Bean(ClassWithDependencies);
//   //
//   // @PostConstruct
//   // postConstruct(
//   //   data: number
//   // ) {
//   //   console.log(123);
//   // }
// }
