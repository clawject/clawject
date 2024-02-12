import { ApplicationBeanDependencyCollectionMetadata, ApplicationBeanDependencyMetadata, ApplicationBeanDependencyPlainMetadata, ApplicationBeanDependencyValueMetadata } from '../metadata/RuntimeApplicationMetadata';
import { Utils } from '../Utils';
import { ApplicationBeanFinder } from './ApplicationBeanFinder';
import { ObjectFactoryResult } from '../api/ObjectFactory';

export class ApplicationBeanDependency {
  constructor(
    public readonly metadata: ApplicationBeanDependencyMetadata,
    private applicationBeanFinder: ApplicationBeanFinder
  ) {}

  getValue(): Promise<any> {
    switch (this.metadata.kind) {
    case 'plain':
      return this.getPlainValue(this.metadata as ApplicationBeanDependencyPlainMetadata);
    case 'value':
      return this.getValueValue(this.metadata as ApplicationBeanDependencyValueMetadata);
    case 'set':
    case 'map':
    case 'array':
      return this.getCollectionValue(this.metadata as ApplicationBeanDependencyCollectionMetadata);
    }
  }

  private async getPlainValue(metadata: ApplicationBeanDependencyPlainMetadata): Promise<any> {
    const bean = this.applicationBeanFinder.find(metadata.configurationIndex, metadata.classPropertyName);
    const beanValue = await bean.getValue();

    if (metadata.nestedProperty) {
      return beanValue[metadata.nestedProperty];
    }

    return beanValue;
  }

  private getValueValue(metadata: ApplicationBeanDependencyValueMetadata): any {
    return metadata.value;
  }

  private async getCollectionValue(metadata: ApplicationBeanDependencyCollectionMetadata): Promise<any> {
    const applicationBeans = metadata.metadata.map((it) => {
      return this.applicationBeanFinder.find(it.configurationIndex, it.classPropertyName);
    });

    if (metadata.kind === 'array') {
      return Promise.all(applicationBeans.map(it => it.getValue()));
    }

    if (metadata.kind === 'set') {
      return new Set(await Promise.all(applicationBeans.map(it => it.getValue())));
    }

    const mapEntries: [string, ObjectFactoryResult][] = await Promise.all(applicationBeans.map(async (it, index) => {
      let name = metadata.metadata[index].classPropertyName;
      const nestedProperty = metadata.metadata[index].nestedProperty;

      if (nestedProperty) {
        const capitalizedNested = Utils.capitalizeFirstLetter(nestedProperty);

        name = `${name}${capitalizedNested}`;
      }

      return [
        name, await it.getValue()
      ];
    }));

    return new Map(mapEntries);
  }
}
