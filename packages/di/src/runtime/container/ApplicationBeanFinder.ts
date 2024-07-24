import { ApplicationBean } from './ApplicationBean';
import { RuntimeErrors } from '../api/RuntimeErrors';
import { ApplicationConfigurationFactory } from './ApplicationConfigurationFactory';

export class ApplicationBeanFinder {
  constructor(
    private configurationIdToBeanClassPropertyToApplicationBean: ReadonlyMap<number, ReadonlyMap<string, ApplicationBean>>,
    private applicationConfigurationFactory: ApplicationConfigurationFactory,
  ) {}

  find(configurationIndex: number, beanClassProperty: string): ApplicationBean {
    const configuration = this.applicationConfigurationFactory.getConfigurationByIndex(configurationIndex);

    const beanClassPropertyToApplicationBean = this.configurationIdToBeanClassPropertyToApplicationBean.get(configuration.id);

    if (!beanClassPropertyToApplicationBean) {
      throw new RuntimeErrors.IllegalStateError('No instantiated configuration found by index');
    }

    if (!beanClassPropertyToApplicationBean.has(beanClassProperty)) {
      throw new RuntimeErrors.IllegalStateError('No application bean found by class property');
    }

    return beanClassPropertyToApplicationBean.get(beanClassProperty)!;
  }
}
