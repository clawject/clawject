import { Context } from './Context';
import { CatContext } from './CatContext';
import { ContextManager } from './internal/ContextManager';

export class ContextDelegate implements Context<any> {
    constructor(
        public instance: CatContext<any, any>,
        public contextManager: ContextManager
    ) {}

    getBean(beanName: string): any {
        return this.contextManager.getBeanFactoryOrThrow(this.instance).getPublicBean(beanName);
    }

    getBeans(): any {
        return this.contextManager.getBeanFactoryOrThrow(this.instance).getPublicBeans();
    }

    getAllBeans(): any {
        return this.contextManager.getBeanFactoryOrThrow(this.instance).getAllBeans();
    }
}
