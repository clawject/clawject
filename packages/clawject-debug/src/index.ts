import { Bean, CatContext, ContainerManager, Lazy, PostConstruct, PreDestroy, Primary } from 'clawject';
import { IMyContext } from './IMyContext';

interface User {}
interface Admin {}

class Repository<T> {
  getData(): T { throw ''; }
  clear(): void {}
}

class Service<T> {
  constructor(
    repository: Repository<T>
  ) {}
}

class Cache<T> {
  clear() {}
}

interface C<T> {}
abstract class A<T> {}
class B<T> extends A<T> implements C<T> {}

class MyContext extends CatContext<IMyContext> {
  userRepository = Bean(Repository<User>);
  adminRepository = Bean(Repository<Admin>);

  userService = Bean(Service<User>);
  adminService = Bean(Service<Admin>);

  userCache = Bean(Cache<User>);
  adminCache = Bean(Cache<Admin>);

  b = Bean(B<string>);

  @PreDestroy
  preDestroy(
    test: C<string>
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
