import React from 'react';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

export const CompareClawjectWithOthers = () => {
  const clawject =
`
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
  primitivesService Bean(PrimitivesService);
}
`;
  const nest =
`
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
    { provide: InjectionTokens.StringRepository, useClass: RepositoryImpl },
    { provide: InjectionTokens.NumberRepository, useClass: RepositoryImpl },
    { provide: InjectionTokens.BooleanRepository, useClass: RepositoryImpl },
  ],
})
class Application {}
`;

  const angular =
`
interface IRepository<T> { /*...*/ }
@Injectable()
class RepositoryImpl<T> implements IRepository<T> { /*...*/ }
const InjectionTokens = {
  StringRepository: new InjectionToken<IRepository<string>>('StringRepository'),
  NumberRepository: new InjectionToken<IRepository<number>>('NumberRepository'),
  BooleanRepository: new InjectionToken<IRepository<boolean>>('BooleanRepository'),
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

@NgModule({
  providers: [
    PrimitivesService,
    { provide: InjectionTokens.StringRepository, useClass: RepositoryImpl },
    { provide: InjectionTokens.NumberRepository, useClass: RepositoryImpl },
    { provide: InjectionTokens.BooleanRepository, useClass: RepositoryImpl },
  ],
})
class Application {}
`;

  const tsyringe =
`
interface IRepository<T> { /*...*/ }
@injectable()
class RepositoryImpl<T> implements IRepository<T> { /*...*/ }
const InjectionTokens = {
  StringRepository: Symbol('StringRepository'),
  NumberRepository: Symbol('NumberRepository'),
  BooleanRepository: Symbol('BooleanRepository'),
}

@injectable()
class PrimitivesService {
  constructor(
    @inject(InjectionTokens.StringRepository)
    private stringRepository: IRepository<string>,
    @inject(InjectionTokens.NumberRepository)
    private numberRepository: IRepository<number>,
    @inject(InjectionTokens.BooleanRepository)
    private booleanRepository: IRepository<boolean>,
  ) {}
}

container.register(InjectionTokens.StringRepository, { useClass: RepositoryImpl });
container.register(InjectionTokens.NumberRepository, { useClass: RepositoryImpl });
container.register(InjectionTokens.BooleanRepository, { useClass: RepositoryImpl });
container.register(PrimitivesService, { useClass: PrimitivesService });
`;

  return (
    <Tabs>
      <TabItem value="clawject" label="Clawject" default>
        <CodeBlock showLineNumbers language="typescript">
          {clawject.trim()}
        </CodeBlock>
      </TabItem>
      <TabItem value="nest" label="NestJS">
        <CodeBlock showLineNumbers language="typescript">
          {nest.trim()}
        </CodeBlock>
      </TabItem>
      <TabItem value="angular" label="Angular">
        <CodeBlock showLineNumbers language="typescript">
          {angular.trim()}
        </CodeBlock>
      </TabItem>
      <TabItem value="tsyringe" label="TSyringe">
        <CodeBlock showLineNumbers language="typescript">
          {tsyringe.trim()}
        </CodeBlock>
      </TabItem>
    </Tabs>
  );
};


export const CompareClawjectWithOthersComplex = () => {
  const clawject =
    `
interface ICache<T> {}
class CacheImpl<T> implements ICache<T> {}
interface IRepository<T> { /*...*/ }
class RepositoryImpl<T> implements IRepository<T> {
  constructor(
    private cache: ICache<T>,
  ) {}
}
class PrimitivesService {
  constructor(
    private stringRepository: IRepository<string>,
    private numberRepository: IRepository<number>,
    private booleanRepository: IRepository<boolean>,
  ) {}
}

@ClawjectApplication
class Application {
  stringCache = Bean(CacheImpl<string>);
  numberCache = Bean(CacheImpl<number>);
  booleanCache = Bean(CacheImpl<boolean>);
  stringRepository = Bean(RepositoryImpl<string>);
  numberRepository = Bean(RepositoryImpl<number>);
  booleanRepository = Bean(RepositoryImpl<boolean>);
  primitivesService = Bean(PrimitivesService);
}
`;
  const nest =
    `
interface ICache<T> {}
class CacheImpl<T> implements ICache<T> {}
interface IRepository<T> { /*...*/ }
class RepositoryImpl<T> implements IRepository<T> {
  constructor(
    private cache: ICache<T>,
  ) {}
}

const InjectionTokens = {
  StringCache: Symbol('StringCache'),
  NumberCache: Symbol('NumberCache'),
  BooleanCache: Symbol('BooleanCache'),
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
    { provide: InjectionTokens.StringCache, useClass: CacheImpl },
    { provide: InjectionTokens.NumberCache, useClass: CacheImpl },
    { provide: InjectionTokens.BooleanCache, useClass: CacheImpl },
    {
      provide: InjectionTokens.StringRepository,
      useFactory: (cache: ICache<string>) => new RepositoryImpl(cache),
      inject: [InjectionTokens.StringCache],
    },
    {
      provide: InjectionTokens.NumberRepository,
      useFactory: (cache: ICache<number>) => new RepositoryImpl(cache),
      inject: [InjectionTokens.NumberCache],
    },
    {
      provide: InjectionTokens.BooleanRepository,
      useFactory: (cache: ICache<boolean>) => new RepositoryImpl(cache),
      inject: [InjectionTokens.BooleanCache],
    },
  ]
})
export class Application {}
`;

  const angular =
    `
interface ICache<T> {}
class CacheImpl<T> implements ICache<T> {}
interface IRepository<T> { /*...*/ }
class RepositoryImpl<T> implements IRepository<T> {
  constructor(
    private cache: ICache<T>,
  ) {}
}

const InjectionTokens = {
  StringCache: new InjectionToken<ICache<string>>('StringCache'),
  NumberCache: new InjectionToken<ICache<number>>('NumberCache'),
  BooleanCache: new InjectionToken<ICache<boolean>>('BooleanCache'),
  StringRepository: new InjectionToken<IRepository<string>>('StringRepository'),
  NumberRepository: new InjectionToken<IRepository<number>>('NumberRepository'),
  BooleanRepository: new InjectionToken<IRepository<boolean>>('BooleanRepository'),
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

@NgModule({
  providers: [
    PrimitivesService,
    { provide: InjectionTokens.StringCache, useClass: CacheImpl },
    { provide: InjectionTokens.NumberCache, useClass: CacheImpl },
    { provide: InjectionTokens.BooleanCache, useClass: CacheImpl },
    {
      provide: InjectionTokens.StringRepository,
      useFactory: (cache: ICache<string>) => new RepositoryImpl(cache),
      inject: [InjectionTokens.StringCache],
    },
    {
      provide: InjectionTokens.NumberRepository,
      useFactory: (cache: ICache<number>) => new RepositoryImpl(cache),
      inject: [InjectionTokens.NumberCache],
    },
    {
      provide: InjectionTokens.BooleanRepository,
      useFactory: (cache: ICache<boolean>) => new RepositoryImpl(cache),
      inject: [InjectionTokens.BooleanCache],
    },
  ]
})
export class Application {}
`;

  const tsyringe =
    `
interface ICache<T> {}
class CacheImpl<T> implements ICache<T> {}
interface IRepository<T> { /*...*/ }
class RepositoryImpl<T> implements IRepository<T> {
  constructor(
    private cache: ICache<T>,
  ) {}
}

const InjectionTokens = {
  StringCache: Symbol('StringCache'),
  NumberCache: Symbol('NumberCache'),
  BooleanCache: Symbol('BooleanCache'),
  StringRepository: Symbol('StringRepository'),
  NumberRepository: Symbol('NumberRepository'),
  BooleanRepository: Symbol('BooleanRepository'),
}

@injectable()
class PrimitivesService {
  constructor(
    @inject(InjectionTokens.StringRepository)
    private stringRepository: IRepository<string>,
    @inject(InjectionTokens.NumberRepository)
    private numberRepository: IRepository<number>,
    @inject(InjectionTokens.BooleanRepository)
    private booleanRepository: IRepository<boolean>,
  ) {}
}

container.register(InjectionTokens.StringCache, { useClass: CacheImpl });
container.register(InjectionTokens.NumberCache, { useClass: CacheImpl });
container.register(InjectionTokens.BooleanCache, { useClass: CacheImpl });
container.register(
  InjectionTokens.StringRepository,
  { useFactory: (container) => new RepositoryImpl(container.resolve(InjectionTokens.StringCache)) },
);
container.register(
  InjectionTokens.NumberRepository,
  { useFactory: (container) => new RepositoryImpl(container.resolve(InjectionTokens.NumberCache)) },
);
container.register(
  InjectionTokens.BooleanRepository,
  { useFactory: (container) => new RepositoryImpl(container.resolve(InjectionTokens.BooleanCache)) },
);
container.register(PrimitivesService, { useClass: PrimitivesService });
`;

  return (
    <Tabs>
      <TabItem value="clawject" label="Clawject" default>
        <CodeBlock showLineNumbers language="typescript">
          {clawject.trim()}
        </CodeBlock>
      </TabItem>
      <TabItem value="nest" label="NestJS">
        <CodeBlock showLineNumbers language="typescript">
          {nest.trim()}
        </CodeBlock>
      </TabItem>
      <TabItem value="angular" label="Angular">
        <CodeBlock showLineNumbers language="typescript">
          {angular.trim()}
        </CodeBlock>
      </TabItem>
      <TabItem value="tsyringe" label="TSyringe">
        <CodeBlock showLineNumbers language="typescript">
          {tsyringe.trim()}
        </CodeBlock>
      </TabItem>
    </Tabs>
  );
};


