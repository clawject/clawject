import { ApplicationBean } from './ApplicationBean';

export class ApplicationBeanFinder {
  constructor(
    private configurationIndexToBeanClassPropertyToApplicationBean: ReadonlyMap<number, ReadonlyMap<string, ApplicationBean>>
  ) {}

  find(configurationIndex: number, beanClassProperty: string): ApplicationBean {
    const configurationIndexToBeanClassPropertyToApplicationBean = this.configurationIndexToBeanClassPropertyToApplicationBean.get(configurationIndex);

    if (!configurationIndexToBeanClassPropertyToApplicationBean) {
      //TODO runtime error
      throw new Error('No instantiated configuration found by index');
    }

    if (!configurationIndexToBeanClassPropertyToApplicationBean.has(beanClassProperty)) {
      //TODO runtime error
      throw new Error('No instantiated bean found by class property');
    }

    return configurationIndexToBeanClassPropertyToApplicationBean.get(beanClassProperty)!;
  }
}
