import { Bean, CatContext, PostConstruct, Container } from 'clawject';
import { ClassWithDependencies } from './ClassWithDependencies';

interface IMyPresenter<T> {
    doStuff(data: T): T;
}
class MyContext extends CatContext {
    @Bean string = 'string';
    @Bean number = 123;

    classWithDeps = Bean(ClassWithDependencies);

    @PostConstruct
    postConstruct(
        dep: ClassWithDependencies,
    ): string {
        console.log(dep);
        return '123';
    }
}

Container.initContext({ context: MyContext });
