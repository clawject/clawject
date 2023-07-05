import { Bean, BeforeDestruct, CatContext, ContainerManager, Scope, PostConstruct, Lazy, Embedded } from 'clawject';
import { IMyContext } from './IMyContext';
import { ClassWithDependencies } from './ClassWithDependencies';

class MyContext extends CatContext<IMyContext> {
    @Bean a = 'string1';
    @Bean b = 1;

    classWithDependencies = Bean(ClassWithDependencies);
}

console.log(ContainerManager.init(MyContext).getBeans());

