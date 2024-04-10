import { InternalScopeRegister } from '../scope/InternalScopeRegister';
import { ObjectFactoryImpl } from '../ObjectFactoryImpl';
import { ObjectFactoryResult } from '../api/ObjectFactory';
import { Scope } from '../api/Scope';
import { RuntimeErrors } from '../api/RuntimeErrors';
import { ClassConstructor } from '../api/ClassConstructor';
import { ApplicationBeanDependency } from './ApplicationBeanDependency';
import { ApplicationConfiguration } from './ApplicationConfiguration';
import { MaybeAsync } from '../types/MaybeAsync';
import { ProxyBuilder } from './ProxyBuilder';
import { BeanMetadata } from '../api/BeanMetadata';
import { RuntimeBeanMetadata } from '@clawject/core/runtime-metadata/MetadataTypes';
import { BeanKind } from '@clawject/core/core/bean/BeanKind';

export class ApplicationBean {
  private proxy: any | null = null;
  public readonly name: string;
  private _objectFactory: ObjectFactoryImpl | null = null;

  get objectFactory(): ObjectFactoryImpl {
    if (this._objectFactory === null) {
      throw new RuntimeErrors.IllegalStateError('Object factory not initialized');
    }

    return this._objectFactory;
  }

  constructor(
    public readonly id: number,
    public readonly parentConfiguration: ApplicationConfiguration,
    public readonly beanClassProperty: string,
    public readonly beanMetadata: RuntimeBeanMetadata,
    public readonly dependencies: ApplicationBeanDependency[] | null,
    public readonly classConstructor: ClassConstructor<any> | null,
    public readonly scopeRegister: InternalScopeRegister,
  ) {
    this.name = `${parentConfiguration.index}_${id}_${beanMetadata.qualifiedName}`;
  }

  init(objectFactory: ObjectFactoryImpl): void {
    this._objectFactory = objectFactory;
  }

  getInjectionValue(): MaybeAsync<ObjectFactoryResult> {
    if (this.isProxy) {
      return this.getProxyBean();
    }

    return this.getScopedBeanValue();
  }

  get isProxy(): boolean {
    return this.getScope().useProxy?.() ?? true;
  }

  get isSingleton(): boolean {
    const singletonScope = this.scopeRegister.getScope('singleton');

    return this.getScope() === singletonScope;
  }

  get lazy(): boolean {
    return this.beanMetadata.lazy ?? this.parentConfiguration.metadata.lazy;
  }

  get scopeName(): string | number {
    return this.beanMetadata.scope ?? this.parentConfiguration.metadata.scope;
  }

  get isLifecycleFunction(): boolean {
    return this.beanMetadata.kind === BeanKind.LIFECYCLE_METHOD || this.beanMetadata.kind === BeanKind.LIFECYCLE_ARROW_FUNCTION;
  }

  getScope(): Scope {
    return this.scopeRegister.getScope(this.scopeName);
  }

  getScopedBeanValue = (): MaybeAsync<ObjectFactoryResult> => {
    return this.getScope().get(this.name, this.objectFactory);
  };

  toMetadata(): BeanMetadata {
    return {
      parentConfigurationClassConstructor: this.parentConfiguration.classConstructor,
      parentConfigurationInstance: this.parentConfiguration.instance,
      name: this.name,
      classPropertyName: this.beanClassProperty,
      scope: this.scopeName,
      resolvedConstructor: this.classConstructor,
    };
  }

  private getProxyBean(): any {
    if (!this.proxy) {
      this.proxy = ProxyBuilder.build(this, this.getScopedBeanValue);
    }

    return this.proxy;
  }
}
