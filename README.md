<p align="center">
  <a href="https://clawject.com/" target="_blank"><img src="https://clawject.com/img/logo.svg" align="center" alt="Clawject Logo" width="120" height="120" /></a>
</p>


<p align="center">Ahead of Time, Type-Safe Dependency Injection framework for TypeScript</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@clawject/di">
    <img src="https://img.shields.io/npm/v/%40clawject/di?style=flat-square&color=ff7aa7" alt="npm_version">
  </a>
  <a href="https://github.com/clawject/clawject/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/%40clawject%2Fdi?style=flat-square" alt="license">
  </a>
  <a href="https://conventionalcommits.org">
    <img src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white&style=flat-square" alt="Conventional Commits">
  </a>
</p>

## Description 🚀

Clawject is a Ahead of Time, full-stack, type-safe, declarative Dependency Injection framework for TypeScript.
Clawject designed to make dependency injection and inversion of control in TypeScript as effortless,
clear and intuitive as possible.
It allows defining class dependencies in a declarative way, without the need to use injection tokens or any other boilerplate,
especially when it comes to interfaces and generics.

Check out [Clawject website](https://clawject.com/) for more details and [installation guide](https://clawject.com/docs/setup).

## Motivation 💡

Modern TypeScript projects often rely on Dependency Injection (DI) frameworks to manage complex dependencies and adhere to principles like **Inversion of Control (IoC)**. However, existing DI frameworks frequently come with significant drawbacks:

- **Boilerplate-heavy implementations**: Many frameworks require excessive manual configuration, injection tokens, leading to verbose codebases.
- **Runtime inefficiencies**: Dependency resolution often happens at runtime, introducing latency and making debugging a nightmare.
- **Limited type safety**: Plain types, interfaces and generics are not supported at all, which leads to using of injection tokens, leading to potential runtime errors that could be caught during compile time.
- **Circular dependency chaos**: Most frameworks fail to detect circular dependencies early, causing unexpected stack overflows or runtime crashes.
- **Coupling with framework APIs**: Business logic is frequently tied to DI-specific code, making it harder to maintain and test.

**Clawject** was born out of the desire to overcome these limitations. By leveraging TypeScript’s powerful type system and Ahead of Time (AoT) compilation, Clawject provides a DI framework that is:

- Lightweight and intuitive.
- Completely type-safe, without the need for injection tokens or runtime hacks.
- Optimized for both Node.js and browser environments.
- Focused on compile-time dependency resolution, enabling fast runtime performance.

With Clawject, developers can enjoy the benefits of Dependency Injection while keeping their codebase clean, testable, and scalable. It's designed to bring clarity, speed, and confidence to TypeScript projects of all sizes.

## Getting Started
- Visit [Clawject website](https://clawject.com/) for more details and [installation guide](https://clawject.com/docs/setup).
- Try Clawject on [StackBlitz](https://stackblitz.com/edit/clawei?file=src%2Fmain.ts) without any setup.

## Main Features

- Ahead of Time Dependency Injection based on TypeScript types, full type safety because no injection tokens are used.
- It Can be used both in Node.js and in the browser.
- Declarative and intuitive API.
- Fast at runtime, all dependency-resolution work is done at compile time!
- IDEs support, all errors and warnings are shown right in your code editor window.
- Ahead of Time circular dependencies detection with a clear cycle path, forget about runtime loops and stack overflows!
- No need to refer to a dependency injection library in your business-oriented classes, leave them clean and framework independent!
- Injection scopes support and ability to create your own custom scopes.
- Supports both experimental and stable JavaScript decorators + no dependency on `reflect-metadata` library.
- Minimal runtime overhead.
- Clawject is not modifying your classes, not adding additional runtime fields, so it's safe to use it with any other library or framework.

## Showcase

### Step 1: Declare repository interface
Clawject's main goal is to support [Inversion of Control](https://en.wikipedia.org/wiki/Inversion_of_control) principle
with its **Ahead of Time** Dependency Injection mechanism.

```typescript
// file Repository.ts

export interface Repository<T> {
  getDefaultValue(): T;
}
```

### Step 2: Declare Repository implementation
```typescript
// file RepositoryImpl.ts

import { Repository } from './Repository';

export class RepositoryImpl<T> implements Repository<T> {
  constructor(private defaultValue: T) {}

  getDefaultValue() {
    return this.defaultValue;
  }
}
```

### Step 3: Declare Service class
***Note that:***

`RepositoryImpl` and `PrimitivesService` classes do not contain any references to dependency
injection framework (clawject in our case) in any kind.
They're using pure TypeScript interfaces and types without
any injection tokens and references to actual class implementations.


```typescript
// file PrimitivesService.ts

import { Repository } from './Repository';

export class PrimitivesService {
  constructor(
    private stringRepository: Repository<string>,
    private numberRepository: Repository<number>,
    private booleanRepository: Repository<boolean>
  ) {}

  /* ... */
}
```

### Step 4: Declare Application entrypoint and default values for repositories

```typescript
// file main.ts

import { ClawjectApplication, ClawjectFactory, Bean } from '@clawject/di';
import { RepositoryImpl } from './RepositoryImpl';
import { PrimitivesService } from './PrimitivesService';

@ClawjectApplication
class Application {
  @Bean stringDefaultValue = 'default_string';
  @Bean numberDefaultValue = 42;
  @Bean booleanDefaultValue = true;

  stringRepository = Bean(RepositoryImpl<string>);
  numberRepository = Bean(RepositoryImpl<number>);
  booleanRepository = Bean(RepositoryImpl<boolean>);
  primitivesService = Bean(PrimitivesService);
}

await ClawjectFactory.createApplicationContext(Application);
```

### Try this example
You can play with example on [StackBlitz](https://stackblitz.com/edit/clawei?file=src%2Fmain.ts).

## License

Clawject is [MIT licensed](https://github.com/clawject/clawject/blob/main/LICENSE).
