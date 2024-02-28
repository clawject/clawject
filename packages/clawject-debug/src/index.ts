// import {
//   Bean,
//   ClawjectApplication,
//   ClawjectFactory,
//   ExposeBeans,
//   ObjectFactory,
//   ObjectFactoryResult,
//   PostConstruct,
//   Scope,
//   ScopeRegister
// } from '@clawject/di';
//
// import http from 'node:http';
// import {AsyncLocalStorage} from 'node:async_hooks';
// import {FooConfiguration} from './test';
//
// export class RequestScope implements Scope {
//   private beginCallbacks: (() => Promise<void>)[] = [];
//   private requestIdToNameToInstance = new Map<number, Map<string, any>>();
//   private destructionCallbacks = new Map<number, Map<string, () => void>>();
//
//   registerScopeBeginCallback(callback: () => Promise<void>): void {
//     this.beginCallbacks.push(callback);
//   }
//
//   removeScopeBeginCallback(callback: () => Promise<void>): void {
//     this.beginCallbacks = this.beginCallbacks.filter(cb => cb !== callback);
//   }
//
//   get(name: string, objectFactory: ObjectFactory): ObjectFactoryResult {
//     const conversationId = HttpExecutionContext.getCurrentRequestId();
//     let nameToInstance = this.requestIdToNameToInstance.get(conversationId);
//     if (!nameToInstance) {
//       nameToInstance = new Map();
//       this.requestIdToNameToInstance.set(conversationId, nameToInstance);
//     }
//
//     let object: any;
//
//     if (nameToInstance.has(name)) {
//       object = nameToInstance.get(name);
//     } else {
//       object = objectFactory.getObject();
//       if (object instanceof Promise) {
//         object = object.then(resolvedObject => {
//           nameToInstance!.set(name, resolvedObject);
//           return resolvedObject;
//         });
//       }
//       nameToInstance.set(name, object);
//     }
//
//     return object;
//   }
//
//   remove(name: string): ObjectFactoryResult | null {
//     const conversationId = HttpExecutionContext.getCurrentRequestId();
//     const nameToInstance = this.requestIdToNameToInstance.get(conversationId);
//     if (!nameToInstance) {
//       return null;
//     }
//
//     const instance = nameToInstance.get(name);
//     nameToInstance.delete(name);
//
//     return instance ?? null;
//   }
//
//   registerDestructionCallback(name: string, callback: () => void): void {
//     const conversationId = HttpExecutionContext.getCurrentRequestId();
//     let nameToCallback = this.destructionCallbacks.get(conversationId);
//     if (!nameToCallback) {
//       nameToCallback = new Map();
//       this.destructionCallbacks.set(conversationId, nameToCallback);
//     }
//
//     nameToCallback.set(name, callback);
//   }
// }
//
// export class HttpExecutionContext {
//   private static idSeq = 0;
//   private static asyncLocalStorage = new AsyncLocalStorage<number>();
//   private static requestEndListener: ((requestId: number) => void) | null = null;
//
//   static run(fn: () => void) {
//     this.asyncLocalStorage.run(this.idSeq++, fn);
//   }
//
//   static getCurrentRequestId(): number {
//     //For simplicity - let's assume that AsyncLocalStorage always returns a value
//     return this.asyncLocalStorage.getStore()!;
//   }
//
//   static onRequestEnd(): void {
//     this.requestEndListener?.(this.getCurrentRequestId());
//   }
//
//   static listenOnRequestEnd(callback: (requestId: number) => void): void {
//     this.requestEndListener = callback;
//   }
// }
//
// class RequestObject {
//   @PostConstruct
//   pc() {
//     console.log('PostConstruct RequestObject');
//   }
//
//   getId(): number {
//     return HttpExecutionContext.getCurrentRequestId();
//   }
// }
//
// class MyController {
//   constructor(
//     private request: RequestObject,
//   ) {}
//
//   onRequest(): void {
//     console.log(this.request.getId());
//   }
// }
//
// @ClawjectApplication
// class Application {
//   @Bean
//   @Scope('request')
//   requestObject(): Promise<RequestObject> {
//     return new Promise<RequestObject>(resolve => {
//       setTimeout(() => {
//         resolve(new RequestObject());
//       }, randomIntFromInterval(100, 3000));
//     });
//   }
//
//   myController = Bean(MyController);
//   exposed = ExposeBeans<{ controller: MyController }>();
// }
//
//
// ScopeRegister.registerScope('request', new RequestScope());
// const applicationContext = await ClawjectFactory.createApplicationContext(Application);
// const controller = await applicationContext.getExposedBean('controller');
//
// function randomIntFromInterval(min: number, max: number) { // min and max included
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }
// http.createServer((req, res) => {
//   HttpExecutionContext.run(() => {
//     setTimeout(() => {
//       controller.onRequest();
//       res.end();
//       HttpExecutionContext.onRequestEnd();
//     }, randomIntFromInterval(100, 2000));
//   });
// }).listen(8080);
//
// const a = new FooConfiguration();


import {
  Bean,
  ClawjectApplication,
  Configuration,
  Internal,
  Lazy,
  PostConstruct,
  Primary,
  Qualifier,
  Scope
} from '@clawject/di';

@ClawjectApplication
@Configuration
@Lazy
@Scope('singleton')
@Internal
// @External
class Application {
  @Bean() @Lazy(false) @Scope('singleton') @Primary() @Qualifier('1') @Internal /*@External*/ value = 123;
  @Bean() @Lazy(false) @Scope('singleton') @Primary() @Qualifier('2') @Internal /*@External*/ arrowFunction = () => 123;

  @Bean() @Lazy(false) @Scope('singleton') @Primary() @Qualifier('3') @Internal /*@External*/ method() {
    return 123;
  }

  @Bean() @Lazy(false) @Scope('singleton') @Primary() @Qualifier('4') @Internal /*@External*/ get getter() {
    return 123;
  }

  @PostConstruct pc() {
    return 123;
  }
}
