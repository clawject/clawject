import { InternalCatContext } from './internal/InternalCatContext';
import { Context } from './Context';
import { RuntimeElement } from '../core/runtime-element/RuntimeElement';

export class ContextHolder implements Context<any> {
    constructor(
        public instance: InternalCatContext,
    ) {}

    getBean(beanName: string): any {
        return this.instance[RuntimeElement.GET_BEAN](beanName);
    }

    getBeans(): any {
        return this.instance[RuntimeElement.GET_BEANS]();
    }

    getAllBeans(): any {
        return this.instance[RuntimeElement.GET_ALL_BEANS]();
    }
}
