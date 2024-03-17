![npm_version](https://img.shields.io/npm/v/%40clawject/di?style=flat-square&color=ff7aa7)
![license](https://img.shields.io/npm/l/%40clawject%2Fdi?style=flat-square)

## Introduction 🚀

Clawject is a full-stack, type-safe, declarative Dependency Injection framework for TypeScript.
Clawject designed to make dependency injection and inversion of control in TypeScript as effortless,
clear and intuitive as possible.
It allows defining class dependencies in a declarative way, without the need to use injection tokens or any other boilerplate,
especially when it comes to interfaces and generics.

Check out [Clawject website](https://clawject.com/) for more details and [installation guide](https://clawject.com/docs/setup).

### Code with clawject

```typescript
interface IRepository<T> { /*...*/ }
class RepositoryImpl<T> implements IRepository<T> { /*...*/ }
class PrimitivesService {
  constructor(
    private stringRepository: IRepository<string>,
    private numberRepository: IRepository<number>,
    private booleanRepository: IRepository<boolean>,
  ) {}
}

@ClawjectApplication
class Application {
  stringRepository = Bean(RepositoryImpl<string>);
  numberRepository = Bean(RepositoryImpl<number>);
  booleanRepository = Bean(RepositoryImpl<boolean>);
  primitivesService = Bean(PrimitivesService);
}
```

### Code with other DI libraries

```typescript
interface IRepository<T> { /*...*/ }
@Injectable()
class RepositoryImpl<T> implements IRepository<T> { /*...*/ }
const InjectionTokens = {
  StringRepository: Symbol('StringRepository'),
  NumberRepository: Symbol('NumberRepository'),
  BooleanRepository: Symbol('BooleanRepository'),
}

@Injectable()
class PrimitivesService {
  constructor(
    @Inject(InjectionTokens.StringRepository)
    private stringRepository: IRepository<string>,
    @Inject(InjectionTokens.NumberRepository)
    private numberRepository: IRepository<number>,
    @Inject(InjectionTokens.BooleanRepository)
    private booleanRepository: IRepository<boolean>,
  ) {}
}

@Module({
  providers: [
    PrimitivesService,
    {
      provide: InjectionTokens.StringRepository,
      useClass: RepositoryImpl,
    },
    {
      provide: InjectionTokens.NumberRepository,
      useClass: RepositoryImpl,
    },
    {
      provide: InjectionTokens.BooleanRepository,
      useClass: RepositoryImpl,
    },
  ],
})
class Application {}
```

### Main Features

- Ahead of Time Dependency Injection based on TypeScript types, full type safety because no injection tokens are used.
- Can be used both in Node.js and in the browser.
- Declarative and intuitive API.
- Fast at runtime, all dependency-resolution work is done at compile time!
- IDEs support, all errors and warnings are shown right in your code editor window.
- Ahead of Time circular dependencies detection with a clear cycle path, forget about runtime loops and stack overflows!
- No need to refer to a dependency injection library in your business-oriented classes, leave them clean and framework independent!
- Injection scopes support and ability to create your own custom scopes.
- Supports both experimental and stable JavaScript decorators + no dependency on `reflect-metadata` library.
- Minimal runtime overhead.
- Clawject is not modifying your classes, not adding additional runtime fields, so it's safe to use it with any other library or framework.

### License

Clawject is [MIT licensed](https://github.com/clawject/clawject/blob/main/LICENSE).
