import { ApplicationBeanDependencyCollectionMetadata, ApplicationBeanDependencyMetadata, ApplicationBeanDependencyPlainMetadata, ApplicationBeanDependencyValueMetadata } from '../metadata/RuntimeApplicationMetadata';
import { InternalUtils } from '../InternalUtils';
import { ApplicationBeanFinder } from './ApplicationBeanFinder';

export class ApplicationBeanDependency {
  private static emptyToken = Symbol();

  constructor(
    public readonly metadata: ApplicationBeanDependencyMetadata,
    private applicationBeanFinder: ApplicationBeanFinder
  ) {}

  private _cachedValue: any = ApplicationBeanDependency.emptyToken;

  getValue(): any {
    if (this._cachedValue !== ApplicationBeanDependency.emptyToken) {
      return this._cachedValue;
    }

    let value: any;

    switch (this.metadata.kind) {
    case 'plain':
      value = this.getPlainValue(this.metadata as ApplicationBeanDependencyPlainMetadata);
      break;
    case 'value':
      value = this.getValueValue(this.metadata as ApplicationBeanDependencyValueMetadata);
      break;
    case 'set':
    case 'map':
    case 'array':
      value = this.getCollectionValue(this.metadata as ApplicationBeanDependencyCollectionMetadata);
      break;
    }

    this._cachedValue = value;

    return value;
  }

  private getPlainValue(metadata: ApplicationBeanDependencyPlainMetadata): any {
    const bean = this.applicationBeanFinder.find(metadata.configurationIndex, metadata.classPropertyName);

    if (metadata.nestedProperty) {
      return bean.getValue()[metadata.nestedProperty];
    }

    return bean.getValue();
  }

  private getValueValue(metadata: ApplicationBeanDependencyValueMetadata): any {
    return metadata.value;
  }

  private getCollectionValue(metadata: ApplicationBeanDependencyCollectionMetadata): any {
    const applicationBeans = metadata.metadata.map((it) => {
      return this.applicationBeanFinder.find(it.configurationIndex, it.classPropertyName);
    });

    if (metadata.kind === 'array') {
      return applicationBeans.map(it => it.getValue());
    }

    if (metadata.kind === 'set') {
      return new Set(applicationBeans.map(it => it.getValue()));
    }

    return new Map(applicationBeans.map((it, index) => {
      let name = metadata.metadata[index].classPropertyName;
      const nestedProperty = metadata.metadata[index].nestedProperty;

      if (nestedProperty) {
        const capitalizedNested = InternalUtils.capitalizeFirstLetter(nestedProperty);

        name = `${name}${capitalizedNested}`;
      }

      return [
        name, it.getValue()
      ];
    }));
  }
}
