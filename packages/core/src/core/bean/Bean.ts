import type ts from 'typescript';
import { BeanKind } from './BeanKind';
import { Configuration } from '../configuration/Configuration';
import { Dependency } from '../dependency/Dependency';
import { Entity } from '../Entity';
import { CType } from '../type-system/CType';
import { capitalizeFirstLetter } from '../utils/captializeFirstLetter';
import { BeanDefinitionMetadata } from '../metadata/v2/bean/BeanDefinitionMetadata';

export type BeanNode = ts.PropertyDeclaration | ts.GetAccessorDeclaration;

export class Bean<T extends BeanNode = BeanNode> extends Entity<T> {
  declare id: string;
  declare parentConfiguration: Configuration; //Set by Context or Configuration during registration
  declare classMemberName: string;
  declare kind: BeanKind;
  declare cType: CType;
  declare definitionMetadata: BeanDefinitionMetadata;

  external: boolean | null = null;
  dependencies = new Set<Dependency>();
  //Only when bean is annotated with @Embedded
  embeddedParent: Bean | null = null;
  nestedProperty: string | null = null;

  signatureRelatedFileNames = new Set<string>();

  constructor(values: Partial<Bean> = {}) {
    super();

    Object.assign(this, values);
  }

  registerDependency(dependency: Dependency): void {
    this.dependencies.add(dependency);
  }

  isInternal(): boolean {
    if (this.definitionMetadata.internal === null) {
      return this.parentConfiguration.definitionMetadata.internal;
    }

    return this.definitionMetadata.internal;
  }

  isExternal(): boolean {
    return !this.isInternal();
  }

  get fullName(): string {
    const qualifiedName = this.classMemberName;

    if (this.nestedProperty === null) {
      return qualifiedName;
    }

    return qualifiedName + capitalizeFirstLetter(this.nestedProperty);
  }

  isLifecycle(): boolean {
    return this.kind === BeanKind.V2_LIFECYCLE;
  }
}
