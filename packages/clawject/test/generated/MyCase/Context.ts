import { CatContext, Bean } from 'clawject';

interface IMyContext {
    foo: string
}

export class MyContext extends CatContext<IMyContext> {
    @Bean foo = 'foo'
    @Bean bar = 'bar'
}
