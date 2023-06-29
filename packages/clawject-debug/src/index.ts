import { Bean, CatContext, PostConstruct, ContainerManager, BeforeDestruct } from 'clawject';
import { ClassWithDependencies } from './ClassWithDependencies';

interface IMyPresenter<T> {
    doStuff(data: T): T;
}

class MyClass {
    @PostConstruct
    postConstruct(): void {

    }
    @BeforeDestruct
    beforeDestruct(): void {

    }
    @PostConstruct
    @BeforeDestruct
    postConstructAndBeforeDestruct(): void {

    }
}

class MyContext extends CatContext {
    @Bean tuple: [number, number] = [1, 2];
    @Bean string = 'string';
    @Bean number = 123;

    classWithDeps = Bean(ClassWithDependencies);

    @PostConstruct
    postConstruct(
        dep: [number, number],
    ): string {
        console.log(dep);
        return '123';
    }
}

const data = ContainerManager.init(MyContext);
