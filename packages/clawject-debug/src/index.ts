import { Bean, CatContext, ContainerManager, PostConstruct, Primary } from 'clawject';
import { IMyContext } from './IMyContext';

interface User {}
interface Admin {}

class Repository<T> {
  getData(): T { throw ''; }
  clear(): void {}
}

class UserService {
  constructor(
    repository: Repository<User>
  ) {}
}

class AdminService {
  constructor(
    repository: Repository<Admin>,
  ) {}
}

interface A {}

class AImpl implements A {}

class MyContext extends CatContext<IMyContext> {
  // userRepository = Bean(Repository<User>);
  // adminRepository = Bean(Repository<Admin>);
  //
  // userService = Bean(UserService);
  // adminService = Bean(AdminService);

  a = Bean(AImpl);

  @PostConstruct
  postConstruct(
    aaa: A,
  ): void {

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
