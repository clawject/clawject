# Clawject

![npm_version](https://img.shields.io/npm/v/%40clawject/di?style=flat-square&color=ff7aa7)
![license](https://img.shields.io/npm/l/%40clawject%2Fdi?style=flat-square)

Clawject is TypeScript Dependency Injection framework that's here to make your coding life easier.
Forget about **injection tokens**, **providers** and a huge number of **decorators on and in your business classes**.
Use typescript features like interfaces, generics, type hierarchies in a declarative and intuitive way and let Clawject do messy work for you!

Check out [Clawject documentation](https://clawject.com/docs/) for more details.

```typescript
import { Bean, CatContext, ContainerManager, PostConstruct } from '@clawject/di';
import { Customer, Store } from './models';

interface ICache<T> {}
class CacheImpl<T> implements ICache<T> { /* ... */ }

class Service {
  constructor(
    private customerCache: ICache<Customer>,
    private storeCache: ICache<Store>,
  ) {}

  start() {
    // ...
  }
}

class ApplicationContext extends CatContext {
  customerCache = Bean(CacheImpl<Customer>)
  storeCache = Bean(CacheImpl<Store>)
  service = Bean(Service)

  @PostConstruct
  init(service: Service) {
    service.start();
  }
}

ContainerManager.init(ApplicationContext);
```

## Main Features

- Ahead of Time Dependency Injection based on TypeScript types.
- Declarative and intuitive API.
- Fast at runtime, all dependency-resolution work is done at compile time!
- IDEs support, all errors and warnings are shown right in your code editor window.
- Ahead of Time circular dependencies detection with a clear cycle path, forget about runtime loops and stack overflows!
- No need to use injection tokens and providers.
- No need to refer to a dependency injection library in your business-oriented classes, leave them clean and framework independent!
- Injection scopes support and ability to create your own custom scopes.
- Lifecycle events support.
- Supports both experimental and stable JavaScript decorators.
- Minimal runtime overhead.
- Clawject is not modifying your classes, not adding additional fields, so it's safe to use it with any other library or framework.

