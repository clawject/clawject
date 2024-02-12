import React from 'react';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { useFormattedCode } from '@site/src/docs-components/useFormattedCode';

export const CompareClawjectWithOthers = () => {
  const clawject = useFormattedCode(
    `
interface Cat { /* ... */ }
interface Dog { /* ... */ }
interface PetOwner<T> {}

class PetOwnerImpl<T> implements PetOwner<T> { /* ... */ }

class OwnersService {
  constructor(
    private catOwner: PetOwner<Cat>,
    private dogOwner: PetOwner<Dog>,
  ) {}
}

@ClawjectApplication
class Application {
  catOwner = Bean(PetOwnerImpl<Cat>)
  dogOwner = Bean(PetOwnerImpl<Dog>)
  ownersService = Bean(OwnersService)
}
    `,
    'typescript'
  );
  const nest = useFormattedCode(
    `
interface Cat { /* ... */ }
interface Dog { /* ... */ }
interface PetOwner<T> {}

@Injectable()
class PetOwnerImpl<T> implements PetOwner<T> { /* ... */ }

const InjectionTokens = {
  CatOwner: Symbol('CatOwner'),
  DogOwner: Symbol('DogOwner'),
};

@Injectable()
class OwnersService {
  constructor(
    @Inject(InjectionTokens.CatOwner)
    private catOwner: PetOwner<Cat>,
    @Inject(InjectionTokens.DogOwner)
    private dogOwner: PetOwner<Dog>,
  ) {}
}

@Module({
  providers: [
    OwnersService,
    {
      provide: InjectionTokens.CatOwner,
      useClass: PetOwnerImpl,
    },
    {
      provide: InjectionTokens.DogOwner,
      useClass: PetOwnerImpl,
    },
  ],
})
class ApplicationModule {}

    `,
    'typescript'
  );

  const angular = useFormattedCode(
    `
interface Cat { /* ... */ }
interface Dog { /* ... */ }
interface PetOwner<T> {}

@Injectable()
class PetOwnerImpl<T> implements PetOwner<T> { /* ... */ }

const InjectionTokens = {
  CatOwner: new InjectionToken<PetOwner<Cat>>('CatOwner'),
  DogOwner: new InjectionToken<PetOwner<Dog>>('DogOwner'),
};

@Injectable()
class OwnersService {
  constructor(
    @Inject(InjectionTokens.CatOwner)
    private catOwner: PetOwner<Cat>,
    @Inject(InjectionTokens.DogOwner)
    private dogOwner: PetOwner<Dog>,
  ) {}
}

@NgModule({
  providers: [
    OwnersService,
    {
      provide: InjectionTokens.CatOwner,
      useClass: PetOwnerImpl,
    },
    {
      provide: InjectionTokens.DogOwner,
      useClass: PetOwnerImpl,
    },
 ]
})
class ApplicationModule {}
`,
    'typescript'
  );

  const tsyringe = useFormattedCode(
    `
interface Cat { /* ... */ }
interface Dog { /* ... */ }
interface PetOwner<T> {}

@injectable()
class PetOwnerImpl<T> implements PetOwner<T> { /* ... */ }

const InjectionTokens = {
  CatOwner: Symbol("CatOwner"),
  DogOwner: Symbol("DogOwner"),
};

@injectable()
class OwnersService {
  constructor(
    @inject(InjectionTokens.CatOwner)
    private catOwner: PetOwner<Cat>,
    @inject(InjectionTokens.DogOwner)
    private dogOwner: PetOwner<Dog>,
  ) {}
}

container.register(InjectionTokens.CatOwner, { useClass: PetOwnerImpl });
container.register(InjectionTokens.DogOwner, { useClass: PetOwnerImpl });
container.register(OwnersService, { useClass: OwnersService });
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

