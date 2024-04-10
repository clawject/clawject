import { Utils } from '../Utils';
import { ApplicationBeanFinder } from './ApplicationBeanFinder';
import { DependencyInjectionValue } from './DependencyInjectionValue';
import { ProxyBuilder } from './ProxyBuilder';
import { ApplicationBean } from './ApplicationBean';
import { BeanDependencyIdProvider } from './BeanDependencyIdProvider';
import { ApplicationBeanDependencyCollectionMetadata, ApplicationBeanDependencyMetadata, ApplicationBeanDependencyPlainMetadata, ApplicationBeanDependencyValueMetadata } from '@clawject/core/runtime-metadata/RuntimeApplicationMetadata';

export class ApplicationBeanDependency {
  constructor(
    public readonly metadata: ApplicationBeanDependencyMetadata,
    private applicationBeanFinder: ApplicationBeanFinder
  ) {}

  public readonly id = BeanDependencyIdProvider.getAndInc();

  async getValue(): Promise<DependencyInjectionValue> {
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

  private async getPlainValue(metadata: ApplicationBeanDependencyPlainMetadata | ApplicationBeanDependencyCollectionMetadata['metadata'][0]): Promise<DependencyInjectionValue> {
    const bean = this.applicationBeanFinder.find(metadata.configurationIndex, metadata.classPropertyName);

    return bean.isProxy
      ? this.getProxyInjectionValue(bean, metadata)
      : this.getNonProxyInjectionValue(bean, metadata);
  }

  private async getNonProxyInjectionValue(bean: ApplicationBean, metadata: ApplicationBeanDependencyPlainMetadata | ApplicationBeanDependencyCollectionMetadata['metadata'][0]): Promise<DependencyInjectionValue> {
    const beanValue = await bean.getInjectionValue();

    if (metadata.nestedProperty) {
      return new DependencyInjectionValue(beanValue[metadata.nestedProperty]);
    }

    return new DependencyInjectionValue(beanValue);
  }

  private getProxyInjectionValue(bean: ApplicationBean, metadata: ApplicationBeanDependencyPlainMetadata | ApplicationBeanDependencyCollectionMetadata['metadata'][0]): DependencyInjectionValue {
    const injectionValue = bean.getInjectionValue();
    const nestedProperty = metadata.nestedProperty;

    if (nestedProperty) {
      const proxy = ProxyBuilder.build(bean, () => injectionValue[nestedProperty]);

      return new DependencyInjectionValue(proxy);
    }

    return new DependencyInjectionValue(bean.getInjectionValue());
  }

  private getValueValue(metadata: ApplicationBeanDependencyValueMetadata): DependencyInjectionValue {
    return new DependencyInjectionValue(metadata.value);
  }

  private async getCollectionValue(metadata: ApplicationBeanDependencyCollectionMetadata): Promise<DependencyInjectionValue> {
    if (metadata.kind === 'array' || metadata.kind === 'set') {
      const values = await Promise.all(metadata.metadata.map(it => this.getPlainValue(it)));
      const valuesArray = values.map(it => it.value);

      if (metadata.kind === 'array') {
        return new DependencyInjectionValue(valuesArray);
      }

      return new DependencyInjectionValue(new Set(valuesArray));
    }

    const mapEntries = await Promise.all(metadata.metadata.map(async it => {
      let name = it.classPropertyName;
      const nestedProperty = it.nestedProperty;

      if (nestedProperty) {
        const capitalizedNested = Utils.capitalizeFirstLetter(nestedProperty);

        name = `${name}${capitalizedNested}`;
      }

      const value = await this.getPlainValue(it);

      return [
        name, value.value,
      ] as const;
    }));

    return new DependencyInjectionValue(new Map(mapEntries));
  }
}
