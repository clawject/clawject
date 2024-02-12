import { ClassConstructor } from '../api/ClassConstructor';
import { ApplicationBeanFactory } from './ApplicationBeanFactory';
import { ApplicationConfigurationFactory } from './ApplicationConfigurationFactory';
import { MetadataStorage } from '../metadata/MetadataStorage';
import { RuntimeErrors } from '../api/RuntimeErrors';

export class ClawjectContainer {
  private applicationConfigurationFactory = new ApplicationConfigurationFactory();
  private applicationBeanFactory = new ApplicationBeanFactory(this.applicationConfigurationFactory);

  constructor(
    public readonly applicationClass: ClassConstructor<any>
  ) {}

  async init(): Promise<void> {
    const applicationMetadata = MetadataStorage.getApplicationMetadata(this.applicationClass);

    if (applicationMetadata === null) {
      throw new RuntimeErrors.NoClassMetadataFoundError('No application metadata found');
    }

    await this.applicationConfigurationFactory.init(this.applicationClass);
    await this.applicationBeanFactory.init(applicationMetadata);
  }

  async postInit(): Promise<void> {
    await this.applicationBeanFactory.postInit();
  }

  async destroy(): Promise<void> {
    this.applicationBeanFactory.destroy();
  }

  getExportedBean(beanName: string): Promise<any> {
    return this.applicationBeanFactory.getExportedBean(beanName);
  }

  getExportedBeans(): Promise<Record<string, any>> {
    return this.applicationBeanFactory.getExportedBeans();
  }
}
