import { ClassConstructor } from './ClassConstructor';

export class ApplicationManager {
  private static configurationInstances = new Map<ClassConstructor<any>, any>();
  private static idToFactory = new Map<string, () => any>();
  private static idToPrioritizedResolvedIds = new Map<string, string[]>();
  private static emptyBean = {};

  static registerConfiguration<T extends object>(configuration: ClassConstructor<T>, configurationFactory: () => T): void {
    const configurationInstance = configurationFactory();

    this.configurationInstances.set(configuration, configurationInstance);

    const init = undefined;

    //TODO handle when init empty
  }

  static registerBean(
    id: string,
    factory: () => any,
  ): void {
    this.idToFactory.set(id, factory);
  }

  //TODO add support for set map and array
  static registerDependency(id: string, prioritizedResolvedBeanIds: string[]): void {
    this.idToPrioritizedResolvedIds.set(id, prioritizedResolvedBeanIds);
  }

  //TODO add support for set map and array
  static getDependency(id: string): any {
    const prioritizedResolvedBeanIds = this.idToPrioritizedResolvedIds.get(id);

    if (!prioritizedResolvedBeanIds) {
      //TODO consider add additional information for debug
      throw new Error(`Dependency ${id} is not registered`);
    }

    let resolvedBean: any = this.emptyBean;

    for (const resolvedBeanId of prioritizedResolvedBeanIds) {
      const beanFactory = this.idToFactory.get(resolvedBeanId);

      if (beanFactory) {
        resolvedBean = beanFactory();
        break;
      }
    }

    if (resolvedBean === this.emptyBean) {
      //TODO consider add additional information for debug
      throw new Error(`Could not resolve dependency for ${id}`);
    }

    return resolvedBean;
  }
}
