import { ApplicationBean } from './ApplicationBean';
import { RuntimeErrors } from '../api/RuntimeErrors';

export class ApplicationBeanFinder {
  constructor(
    private configurationIndexToBeanClassPropertyToApplicationBean: ReadonlyMap<number, ReadonlyMap<string, ApplicationBean>>
  ) {}

  find(configurationIndex: number, beanClassProperty: string): ApplicationBean {
    const configurationIndexToBeanClassPropertyToApplicationBean = this.configurationIndexToBeanClassPropertyToApplicationBean.get(configurationIndex);

    if (!configurationIndexToBeanClassPropertyToApplicationBean) {
      throw new RuntimeErrors.IllegalStateError('No instantiated configuration found by index');
    }

    if (!configurationIndexToBeanClassPropertyToApplicationBean.has(beanClassProperty)) {
      throw new RuntimeErrors.IllegalStateError('No application bean found by class property');
    }

    return configurationIndexToBeanClassPropertyToApplicationBean.get(beanClassProperty)!;
  }
}
