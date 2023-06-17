import { InternalCatContext } from './InternalCatContext';
import { Context } from './Context';

export class ContextHolder implements Context<any> {
    constructor(
        public instance: InternalCatContext,
    ) {}

    getBean(beanName: string): any {
        return this.instance.clawject_getBean(beanName);
    }

    getBeans(): any {
        return this.instance.clawject_getBeans();
    }
}
