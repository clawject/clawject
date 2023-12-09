import { InitializedContext } from './InitializedContext';
import { CatContext } from './CatContext';
import { ContextManager } from './ContextManager';

export class InitializedContextImpl implements InitializedContext<any> {
  constructor(
    public instance: CatContext<any, any>,
  ) {}

  getBean(beanName: string): any {
    return ContextManager.getBeanFactoryOrThrow(this.instance).getPublicBean(beanName);
  }

  getBeans(): any {
    return ContextManager.getBeanFactoryOrThrow(this.instance).getPublicBeans();
  }

  getAllBeans(): any {
    return ContextManager.getBeanFactoryOrThrow(this.instance).getAllBeans();
  }
}
