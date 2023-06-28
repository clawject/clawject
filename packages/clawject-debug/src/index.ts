import { Bean, CatContext, PostConstruct, ContainerManager } from 'clawject';
import { ClassWithDependencies } from './ClassWithDependencies';

interface IMyPresenter<T> {
    doStuff(data: T): T;
}

class MyContext extends CatContext<{ data: string }> {
    @Bean tuple: [number, number] = [1, 2];
    @Bean string = 'string';
    @Bean number = 123;

    classWithDeps = Bean(ClassWithDependencies);

    @PostConstruct
    postConstruct(
        dep: [number, number],
    ): string {
        console.log(dep);
        this.context.data;
        return '123';
    }
}

const data = ContainerManager.init(MyContext);
