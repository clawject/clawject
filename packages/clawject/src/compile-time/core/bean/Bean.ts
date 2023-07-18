import ts from 'typescript';
import { DIType } from '../type-system/DIType';
import { ClassPropertyWithArrowFunctionInitializer, ClassPropertyWithCallExpressionInitializer, ClassPropertyWithExpressionInitializer } from '../ts/types';
import { BeanKind } from './BeanKind';
import { Configuration } from '../configuration/Configuration';
import { Dependency } from '../dependency/Dependency';
import { BaseElement } from '../BaseElement';
import { LifecycleKind } from '../component-lifecycle/LifecycleKind';
import { DisposableNodeHolder } from '../DisposableNodeHolder';
import { WeakNodeHolder } from '../WeakNodeHolder';
import { FileGraph } from '../file-graph/FileGraph';

export type BeanNode = ts.MethodDeclaration
  | ClassPropertyWithCallExpressionInitializer
  | ClassPropertyWithArrowFunctionInitializer
  | ts.PropertyDeclaration
  | ClassPropertyWithExpressionInitializer;

export class Bean<T extends BeanNode = BeanNode> extends BaseElement<T> {
  declare id: string; //Set by Context or Configuration during registration
  declare parentConfiguration: Configuration; //Set by Context or Configuration during registration
  declare classMemberName: string;
  declare diType: DIType;
  declare kind: BeanKind;
  classDeclaration: WeakNodeHolder<ts.ClassDeclaration> | null = null;
  genericSymbolLookupTable = new WeakMap<ts.Symbol, DIType>();
  lifecycle: LifecycleKind[] | null = null;
  public = false;
  primary = false;
  dependencies = new Set<Dependency>();
  //Only when bean is annotated with @Embedded
  embeddedElements = new Map<string, DIType>();
  scopeExpression = new DisposableNodeHolder<ts.Expression>();
  lazyExpression = new DisposableNodeHolder<ts.Expression>();

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
    //TODO check if this is correct
    return `${this.classMemberName}`;
  }

  isLifecycle(): boolean {
    return this.kind === BeanKind.LIFECYCLE_METHOD || this.kind === BeanKind.LIFECYCLE_ARROW_FUNCTION;
  }
}
