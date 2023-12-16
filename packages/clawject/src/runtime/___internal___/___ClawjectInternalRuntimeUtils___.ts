import { MetadataStorage } from '../metadata/MetadataStorage';
import { ContextManager } from '../ContextManager';

type BeanNameDescriptor = [name: string, nested?: string, fullName?: string];

export class ___ClawjectInternalRuntimeUtils___ {
  public static bean(names: BeanNameDescriptor, instance: any): any {
    const [name, nested] = names;

    const bean = ContextManager.getPrivateBeanFromFactory(name, instance);

    if (nested !== undefined) {
      return bean[nested];
    }

    return bean;
  }

  public static beanArray(names: BeanNameDescriptor[], instance: any): any[] {
    return names.map(name => this.bean(name, instance));
  }

  public static beanSet(names: BeanNameDescriptor[], instance: any): Set<any> {
    return new Set(this.beanArray(names, instance));
  }

  public static beanMap(names: BeanNameDescriptor[], instance: any): Map<any, any> {
    return new Map(
      names.map(name => [name[2] ?? name[0], this.bean(name, instance)])
    );
  }

  public static defineContextMetadata(classConstructor: any, metadata: any): void {
    MetadataStorage.setContextMetadata(classConstructor, metadata);
  }

  public static defineComponentMetadata(classConstructor: any, metadata: any): void {
    MetadataStorage.setComponentMetadata(classConstructor, metadata);
  }

  public static defineConfigurationMetadata(classConstructor: any, metadata: any): void {
    MetadataStorage.setConfigurationMetadata(classConstructor, metadata);
  }

  public static defineApplicationMetadata(classConstructor: any, metadata: any): void {
    MetadataStorage.setApplicationMetadata(classConstructor, metadata);
  }
}
