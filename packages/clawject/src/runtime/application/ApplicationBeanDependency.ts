import { ApplicationBeanDependencyCollectionMetadata, ApplicationBeanDependencyMetadata, ApplicationBeanDependencyPlainMetadata, ApplicationBeanDependencyValueMetadata } from '../metadata/RuntimeApplicationMetadata';
import { InternalUtils } from '../InternalUtils';
import { ApplicationBeanFinder } from './ApplicationBeanFinder';
import { ObjectFactoryResult } from '../object-factory/ObjectFactory';

export class ApplicationBeanDependency {
  private static emptyToken = Symbol();

  constructor(
    public readonly metadata: ApplicationBeanDependencyMetadata,
    private applicationBeanFinder: ApplicationBeanFinder
  ) {}

  private _cachedValue: any = ApplicationBeanDependency.emptyToken;

  async getValue(): Promise<any> {
    if (this._cachedValue !== ApplicationBeanDependency.emptyToken) {
      return this._cachedValue;
    }

    let value: any;

    switch (this.metadata.kind) {
    case 'plain':
      value = await this.getPlainValue(this.metadata as ApplicationBeanDependencyPlainMetadata);
      break;
    case 'value':
      value = await this.getValueValue(this.metadata as ApplicationBeanDependencyValueMetadata);
      break;
    case 'set':
    case 'map':
    case 'array':
      value = await this.getCollectionValue(this.metadata as ApplicationBeanDependencyCollectionMetadata);
      break;
    }

    this._cachedValue = value;

    return value;
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

    const mapEntries: [string, ObjectFactoryResult][] = await Promise.all(applicationBeans.map(async(it, index) => {
      let name = metadata.metadata[index].classPropertyName;
      const nestedProperty = metadata.metadata[index].nestedProperty;

      if (nestedProperty) {
        const capitalizedNested = InternalUtils.capitalizeFirstLetter(nestedProperty);

        name = `${name}${capitalizedNested}`;
      }

      return [
        name, await it.getValue()
      ];
    }));

    return new Map(mapEntries);
  }
}
