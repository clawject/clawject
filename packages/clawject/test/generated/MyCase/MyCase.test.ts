import { Container } from 'clawject';
import { MyContext } from './Context';

const context = Container.initContext({
    context: MyContext,
});

console.log(context.getAllBeans());
