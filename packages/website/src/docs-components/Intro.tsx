import React from 'react';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { useFormattedCode } from '@site/src/docs-components/useFormattedCode';

export const CompareClawjectWithOthers = () => {
  const clawject = useFormattedCode(
    `
interface ICache<T> {}
class CacheImpl<T> implements ICache<T> { /* ... */ }

    class Service {
    constructor(
      private customerCache: ICache<Customer>,
      private storeCache: ICache<Store>,
    ) {}
    }

  class ApplicationContext extends CatContext {
    customerCache = Bean(CacheImpl<Customer>)
    storeCache = Bean(CacheImpl<Store>)
    service = Bean(Service)
  }
    `,
    'typescript'
  );
  const nest = useFormattedCode(
    `
interface ICache<T> {}
@Injectable()
class CacheImpl<T> implements ICache<T> { /* ... */ }

const InjectionTokens = {
  CustomerCache: Symbol('CustomerCache'),
  StoreCache: Symbol('StoreCache'),
};

@Injectable()
class Service {
  constructor(
    @Inject(InjectionTokens.CustomerCache)
    private customerCache: ICache<Customer>,
    @Inject(InjectionTokens.StoreCache)
    private storeCache: ICache<Store>,
  ) {}
}

@Module({
  providers: [
    Service,
    {
      provide: InjectionTokens.CustomerCache,
      useClass: CacheImpl,
    },

    {
      provide: InjectionTokens.StoreCache,
      useClass: CacheImpl,
    },
  ],
})
class AppModule {}

    `,
    'typescript'
  );
  const angular = useFormattedCode(
    `
    interface ICache<T> {}
@Injectable()
class CacheImpl<T> implements ICache<T> {
  /* ... */
}

const InjectionTokens = {
  CustomerCache: new InjectionToken<ICache<Customer>>('CustomerCache'),
  StoreCache: new InjectionToken<ICache<Store>>('StoreCache'),
};

@Injectable()
class Service {
  constructor(
    @Inject(InjectionTokens.CustomerCache)
    private customerCache: ICache<Customer>,
    @Inject(InjectionTokens.StoreCache)
    private storeCache: ICache<Store>,
  ) {}
}

@NgModule({
  providers: [
    Service,
    {
      provide: InjectionTokens.CustomerCache,
      useClass: CacheImpl,
    },
    {
      provide: InjectionTokens.StoreCache,
      useClass: CacheImpl,
    },
 ]
})
class AppModule {}
`,
    'typescript'
  );

  const tsyringe = useFormattedCode(
    `
interface ICache<T> {}
@injectable()
class CacheImpl<T> implements ICache<T> { /* ... */ }

const InjectionTokens = {
  CustomerCache: Symbol("CustomerCache"),
  StoreCache: Symbol("StoreCache"),
};

@injectable()
class Service {
  constructor(
    @inject(InjectionTokens.CustomerCache)
    private customerCache: ICache<Customer>,
    @inject(InjectionTokens.StoreCache)
   private storeCache: ICache<Store>,
  ) {}
}

container.register(InjectionTokens.CustomerCache, { useClass: CacheImpl });
container.register(InjectionTokens.StoreCache, { useClass: CacheImpl });
container.register(Service, { useClass: Service });

const service = container.resolve(Service);
    `,
    'typescript'
  );

  return (
    <Tabs>
      <TabItem value="clawject" label="Clawject" default>
        <CodeBlock showLineNumbers language="typescript">
          {clawject}
        </CodeBlock>
      </TabItem>
      <TabItem value="nest" label="NestJS">
        <CodeBlock showLineNumbers language="typescript">
          {nest}
        </CodeBlock>
      </TabItem>
      <TabItem value="angular" label="Angular">
        <CodeBlock showLineNumbers language="typescript">
          {angular}
        </CodeBlock>
      </TabItem>
      <TabItem value="tsyringe" label="TSyringe">
        <CodeBlock showLineNumbers language="typescript">
          {tsyringe}
        </CodeBlock>
      </TabItem>
    </Tabs>
  );
};

