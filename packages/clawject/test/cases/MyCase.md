# Context.ts

```ts
import { CatContext, Bean } from 'clawject';

interface IMyContext {
    foo: string
}

export class MyContext extends CatContext<IMyContext> {
    @Bean foo = 'foo'
    @Bean bar = 'bar'
}
```

## MyCase

```ts
import { Container } from 'clawject';
import { MyContext } from './Context';

const context = Container.initContext({
    context: MyContext,
});

console.log(context.getAllBeans());
```
