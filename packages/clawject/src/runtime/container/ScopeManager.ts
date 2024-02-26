import { ApplicationBeanFactory } from './ApplicationBeanFactory';
import { Scope } from '../api/Scope';

export class ScopeManager {
  private callbacks = new WeakMap<Scope, () => Promise<void>>();

  constructor(
    private applicationBeanFactory: ApplicationBeanFactory,
  ) {}

  init(): void {
    const scopeToScopedApplicationBeans = this.applicationBeanFactory.scopeToScopedApplicationBeans;

    for (const [scope] of scopeToScopedApplicationBeans) {
      const callback = () => this.applicationBeanFactory.initScopedBeans(scope);
      this.callbacks.set(scope, callback);
      scope.registerScopeBeginCallback(callback);
    }
  }

  close(): void {
    const scopeToScopedApplicationBeans = this.applicationBeanFactory.scopeToScopedApplicationBeans;

    for (const [scope] of scopeToScopedApplicationBeans) {
      const callback = this.callbacks.get(scope);

      if (callback) {
        scope.removeScopeBeginCallback(callback);
      }
    }
  }
}
