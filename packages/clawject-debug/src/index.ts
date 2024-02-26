import {
  Bean,
  ClawjectApplication,
  ClawjectFactory, Embedded,
  ExposeBeans,
  ObjectFactory,
  ObjectFactoryResult,
  PostConstruct,
  PreDestroy,
  Scope,
  ScopeRegister
} from '@clawject/di';

import http from 'node:http';
import {AsyncLocalStorage} from 'node:async_hooks';


export class RequestScope implements Scope {
  static readonly instance = new RequestScope();

  private beginCallbacks: (() => Promise<void>)[] = [];
  private conversationIdToNameToInstance = new Map<number, Map<string, any>>();
  private destructionCallbacks = new Map<number, Map<string, () => void>>();

  async onScopeBegin(): Promise<void> {
    await Promise.all(this.beginCallbacks.map(callback => callback()));
  }

  onScopeEnded(): void {
    const conversationId = HttpExecutionContext.getCurrentRequestId();

    const destructionCallbacks = this.destructionCallbacks.get(conversationId);

    if (destructionCallbacks) {
      destructionCallbacks.forEach(callback => callback());
    }
  }

  registerScopeBeginCallback(callback: () => Promise<void>): void {
    this.beginCallbacks.push(callback);
  }

  removeScopeBeginCallback(callback: () => Promise<void>): void {
    this.beginCallbacks = this.beginCallbacks.filter(cb => cb !== callback);
  }

  get(name: string, objectFactory: ObjectFactory): ObjectFactoryResult {
    const conversationId = HttpExecutionContext.getCurrentRequestId();
    let nameToInstance = this.conversationIdToNameToInstance.get(conversationId);
    if (!nameToInstance) {
      nameToInstance = new Map();
      this.conversationIdToNameToInstance.set(conversationId, nameToInstance);
    }

    let object: any;

    if (nameToInstance.has(name)) {
      object = nameToInstance.get(name);
    } else {
      object = objectFactory.getObject();
      if (object instanceof Promise) {
        object = object.then(resolvedObject => {
          nameToInstance!.set(name, resolvedObject);
          return resolvedObject;
        });
      }
      nameToInstance.set(name, object);
    }

    return object;
  }

  remove(name: string): ObjectFactoryResult | null {
    const conversationId = HttpExecutionContext.getCurrentRequestId();
    const nameToInstance = this.conversationIdToNameToInstance.get(conversationId);
    if (!nameToInstance) {
      return null;
    }

    const instance = nameToInstance.get(name);
    nameToInstance.delete(name);

    return instance ?? null;
  }

  registerDestructionCallback(name: string, callback: () => void): void {
    const conversationId = HttpExecutionContext.getCurrentRequestId();
    let nameToCallback = this.destructionCallbacks.get(conversationId);
    if (!nameToCallback) {
      nameToCallback = new Map();
      this.destructionCallbacks.set(conversationId, nameToCallback);
    }

    nameToCallback.set(name, callback);
  }

  useProxy(): boolean {
    return true;
  }
}
export class HttpExecutionContext {
  private static idSeq = 0;
  private static asyncLocalStorage = new AsyncLocalStorage<number>();

  static run(fn: () => void) {
    this.asyncLocalStorage.run(this.idSeq++, async () => {
      await RequestScope.instance.onScopeBegin();
      fn();
    });
  }

  static getCurrentRequestId(): number {
    return this.asyncLocalStorage.getStore() ?? 0;
  }

  static onRequestEnd(): void {
    RequestScope.instance.onScopeEnded();
  }
}

class RequestObject {
  @PostConstruct
  pc() {
    console.log('PostConstruct RequestObject');
  }

  getId(): number {
    return HttpExecutionContext.getCurrentRequestId();
  }
}

class MyController {
  constructor(
    private request: RequestObject,
  ) {}

  onRequest(): void {
    console.log(this.request.getId());
  }
}

@ClawjectApplication
class Application {
  @Bean
  @Scope('request')
  requestObject(): Promise<RequestObject> {
    return new Promise<RequestObject>(resolve => {
      setTimeout(() => {
        resolve(new RequestObject());
      }, randomIntFromInterval(100, 3000));
    });
  }

  myController = Bean(MyController);
  exposed = ExposeBeans<{ controller: MyController }>();
}


ScopeRegister.registerScope('request', RequestScope.instance);
const applicationContext = await ClawjectFactory.createApplicationContext(Application);
const controller = await applicationContext.getExposedBean('controller');

function randomIntFromInterval(min: number, max: number) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
http.createServer((req, res) => {
  HttpExecutionContext.run(() => {
    setTimeout(() => {
      controller.onRequest();
      res.end();
      HttpExecutionContext.onRequestEnd();
    }, randomIntFromInterval(100, 2000));
  });
}).listen(8080);

