// import { Bean, ClassConstructor, ClawjectApplication, Configuration, Import, Internal, Qualifier } from "@clawject/di";
//
// class Foo {}
//
// class Bar {
//   constructor(data) {}
// }
//
// @Configuration
// class FooConfiguration {
//
// }
//
// const a = 123
//
// @Configuration
// class BarConfiguration {
//   fooConfiguration = Import(FooConfiguration);
//
//   @Bean @Bean data = 123;
//   bar = Bean(Bar);
// }
//
// @ClawjectApplication
// class App {
//   barConfiguration = Import(BarConfiguration);
// }
// const AnyMockingLibrary = {} as any;
//
// const TestConfiguration: (configurationClass: ClassConstructor<any>) => ClassDecorator = {} as any;
// //ParentConfigurationClass is optional and needed when needs to specify the parent configuration class in which the base bean is defined
// const MockBean: (parentConfigurationClass?: ClassConstructor<any>) => PropertyDecorator & MethodDecorator = {} as any;
//
// @TestConfiguration(App)
// class TestApp {
//
//   //TODO Importing other test configurations
//   //TODO Defining regular beans
//
//   @MockBean()
//     //TODO Possible to create as factory function or property or getter, but without dependencies
//     //TODO Scope
//     //TODO Qualifier
//     foo = AnyMockingLibrary.mock(Foo);
// }
//

import { Bean, ClawjectApplication, ClawjectFactory, PostConstruct, Qualifier } from '@clawject/di';

@ClawjectApplication
class Application {
  @Bean foo: undefined = undefined;

  @PostConstruct
  postConstruct(
    foo: number | undefined
  ) {
    console.log(foo);
  }
}


(async () => {
  await ClawjectFactory.createApplicationContext(Application);
})()
