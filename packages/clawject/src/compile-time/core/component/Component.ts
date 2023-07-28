import ts from 'typescript';
import { AutowiredRegister } from '../autowired/AutowiredRegister';
import { Dependency } from '../dependency/Dependency';
import { ComponentLifecycleRegister } from '../component-lifecycle/ComponentLifecycleRegister';
import { BaseElement } from '../BaseElement';
import { DIType } from '../type-system/DIType';
import { DisposableNodeHolder } from '../DisposableNodeHolder';

//TODO add stereotype components
export class Component extends BaseElement<ts.ClassDeclaration> {
  declare id: string;
  declare fileName: string;
  declare className: string;
  qualifier: string | null = null;
  declare explicitDeclaration: boolean;
  genericSymbolLookupTable = new WeakMap<ts.Symbol, DIType>();

  scopeExpression = new DisposableNodeHolder<ts.Expression>();
  lazyExpression = new DisposableNodeHolder<ts.Expression>();

  autowiredRegister = new AutowiredRegister(this);
  componentLifecycleRegister = new ComponentLifecycleRegister(this);
  constructorDependencies = new Set<Dependency>();

  registerConstructorDependency(dependency: Dependency): void {
    this.constructorDependencies.add(dependency);
  }

  get fullName(): string {
    if (this.qualifier !== null) {
      return this.qualifier;
    }

    const firstLower = this.className.at(0)?.toLowerCase() ?? '';

    return `${firstLower}${this.className.slice(1)}`;
  }
}
