import { ClassConstructor } from '../api/ClassConstructor';
import { ApplicationBeanFactory } from './ApplicationBeanFactory';
import { ApplicationConfigurationFactory } from './ApplicationConfigurationFactory';
import { MetadataStorage } from '../MetadataStorage';
import { RuntimeErrors } from '../api/RuntimeErrors';
import { ScopeManager } from './ScopeManager';

import { BeanProcessor } from '../api/BeanProcessor';
import { InternalScopeRegister } from '../scope/InternalScopeRegister';

export class ClawjectContainer {
  public readonly applicationConfigurationFactory: ApplicationConfigurationFactory;
  public readonly applicationBeanFactory: ApplicationBeanFactory;
  public readonly scopeManager: ScopeManager;

  constructor(
    public readonly applicationClass: ClassConstructor<any>,
    public readonly applicationClassConstructorParameters: any[],
    public readonly beanProcessors: BeanProcessor[],
    public readonly scopeRegister: InternalScopeRegister
  ) {
    this.applicationConfigurationFactory = new ApplicationConfigurationFactory();
    this.applicationBeanFactory = new ApplicationBeanFactory(this.applicationConfigurationFactory, this.beanProcessors, this.scopeRegister);
    this.scopeManager = new ScopeManager(this.applicationBeanFactory);
  }

  async init(): Promise<void> {
    const applicationMetadata = MetadataStorage.getApplicationMetadata(this.applicationClass);

    if (applicationMetadata === null) {
      throw new RuntimeErrors.NoClassMetadataFoundError('No application metadata found');
    }

    await this.applicationConfigurationFactory.init(this.applicationClass, this.applicationClassConstructorParameters);
    await this.applicationBeanFactory.init(applicationMetadata);
    this.scopeManager.init();
  }

  async postInit(): Promise<void> {
    await this.applicationBeanFactory.postInit();
  }

  async destroy(): Promise<void> {
    await this.applicationBeanFactory.destroy();
    this.scopeManager.destroy();
  }

  getExposedBean(beanName: string): Promise<any> {
    return this.applicationBeanFactory.getExposedBean(beanName);
  }

  getExposedBeans(): Promise<Record<string, any>> {
    return this.applicationBeanFactory.getExposedBeans();
  }
}
