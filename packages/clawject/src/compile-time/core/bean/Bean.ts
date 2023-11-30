import ts from 'typescript';
import { DIType } from '../type-system/DIType';
import { ClassPropertyWithArrowFunctionInitializer, ClassPropertyWithCallExpressionInitializer, ClassPropertyWithExpressionInitializer } from '../ts/types';
import { BeanKind } from './BeanKind';
import { Configuration } from '../configuration/Configuration';
import { Dependency } from '../dependency/Dependency';
import { Entity } from '../Entity';
import { LifecycleKind } from '../../../runtime/LifecycleKind';
import { DisposableNodeHolder } from '../DisposableNodeHolder';
import { FileGraph } from '../file-graph/FileGraph';
import * as Case from 'case';

export type BeanNode = ts.MethodDeclaration
  | ClassPropertyWithCallExpressionInitializer
  | ClassPropertyWithArrowFunctionInitializer
  | ts.PropertyDeclaration
  | ClassPropertyWithExpressionInitializer
  | ts.GetAccessorDeclaration;

export class Bean<T extends BeanNode = BeanNode> extends Entity<T> {
  declare id: string; //Set by Context or Configuration during registration
  declare parentConfiguration: Configuration; //Set by Context or Configuration during registration
  declare classMemberName: string;
  qualifier: string | null = null;
  declare diType: DIType;
  declare kind: BeanKind;
  lifecycle: LifecycleKind[] | null = null;
  public = false;
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
    dependency.diType.declarationFileNames.forEach(it => {
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
