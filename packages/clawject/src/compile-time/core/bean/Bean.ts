import ts from 'typescript';
import { ClassPropertyWithArrowFunctionInitializer, ClassPropertyWithCallExpressionInitializer, ClassPropertyWithExpressionInitializer } from '../ts/types';
import { BeanKind } from './BeanKind';
import { Configuration } from '../configuration/Configuration';
import { Dependency } from '../dependency/Dependency';
import { Entity } from '../Entity';
import { LifecycleKind } from '../../../runtime/types/LifecycleKind';
import { DisposableNodeHolder } from '../DisposableNodeHolder';
import * as Case from 'case';
import { ConfigLoader } from '../../config/ConfigLoader';
import { CType } from '../type-system/CType';
import { FileGraph } from '../file-graph/FileGraph';

export type BeanNode = ts.MethodDeclaration
  | ClassPropertyWithCallExpressionInitializer
  | ClassPropertyWithArrowFunctionInitializer
  | ts.PropertyDeclaration
  | ClassPropertyWithExpressionInitializer
  | ts.GetAccessorDeclaration;

export class Bean<T extends BeanNode = BeanNode> extends Entity<T> {
  declare id: string;
  declare parentConfiguration: Configuration; //Set by Context or Configuration during registration
  declare classMemberName: string;
  qualifier: string | null = null;
  private _cType: CType | null = null;
  declare kind: BeanKind;
  lifecycle: LifecycleKind[] = [];
  external: boolean | null = null;
  primary = false;
  dependencies = new Set<Dependency>();
  //Only when bean is annotated with @Embedded
  nestedProperty: string | null = null;
  scopeExpression = new DisposableNodeHolder<ts.Expression>();
  lazyExpression = new DisposableNodeHolder<ts.Expression>();
  conditionExpression = new DisposableNodeHolder<ts.Expression>();

  constructor(values: Partial<Bean> = {}) {
    super();

    Object.assign(this, values);
  }

  registerDependency(dependency: Dependency): void {
    this.dependencies.add(dependency);
    dependency.cType.relatedFileNames.forEach(it => {
      FileGraph.add(this.parentConfiguration.fileName, it);
    });
  }

  get cType(): CType {
    if (this._cType === null) {
      throw new Error('CType for bean is not set.');
    }

    return this._cType;
  }

  getExternalValue(): boolean {
    return this.external ?? this.parentConfiguration.external ?? ConfigLoader.get().beans.defaultExternal;
  }

  registerType(cType: CType): void {
    this._cType = cType;
    cType.relatedFileNames.forEach(it => {
      FileGraph.add(this.parentConfiguration.fileName, it);
    });
  }

  get fullName(): string {
    const qualifiedName = this.qualifier ?? this.classMemberName;

    if (this.nestedProperty === null) {
      return qualifiedName;
    }

    return qualifiedName + Case.capital(this.nestedProperty);
  }

  isLifecycle(): boolean {
    return this.kind === BeanKind.LIFECYCLE_METHOD || this.kind === BeanKind.LIFECYCLE_ARROW_FUNCTION;
  }
}
