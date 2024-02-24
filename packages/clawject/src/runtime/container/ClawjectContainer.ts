import { ClassConstructor } from '../api/ClassConstructor';
import { ApplicationBeanFactory } from './ApplicationBeanFactory';
import { ApplicationConfigurationFactory } from './ApplicationConfigurationFactory';
import { MetadataStorage } from '../metadata/MetadataStorage';
import { RuntimeErrors } from '../api/RuntimeErrors';

export class ClawjectContainer {
  public readonly applicationConfigurationFactory = new ApplicationConfigurationFactory();
  public readonly applicationBeanFactory = new ApplicationBeanFactory(this.applicationConfigurationFactory);

  constructor(
    public readonly applicationClass: ClassConstructor<any>,
    public readonly applicationClassConstructorParameters: any[],
  ) {}

  async init(): Promise<void> {
    const applicationMetadata = MetadataStorage.getApplicationMetadata(this.applicationClass);

    if (applicationMetadata === null) {
      throw new RuntimeErrors.NoClassMetadataFoundError('No application metadata found');
    }

    await this.applicationConfigurationFactory.init(this.applicationClass, this.applicationClassConstructorParameters);
    await this.applicationBeanFactory.init(applicationMetadata);
  }

  async postInit(): Promise<void> {
    await this.applicationBeanFactory.postInit();
  }

  async close(): Promise<void> {
    this.applicationBeanFactory.close();
  }

  getExposedBean(beanName: string): Promise<any> {
    return this.applicationBeanFactory.getExposedBean(beanName);
  }

  getExposedBeans(): Promise<Record<string, any>> {
    return this.applicationBeanFactory.getExposedBeans();
  }
}
