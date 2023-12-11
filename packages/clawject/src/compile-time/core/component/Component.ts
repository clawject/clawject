import ts from 'typescript';
import { AutowiredRegister } from '../autowired/AutowiredRegister';
import { Dependency } from '../dependency/Dependency';
import { ComponentLifecycleRegister } from '../component-lifecycle/ComponentLifecycleRegister';
import { Entity } from '../Entity';
import { DIType } from '../type-system/DIType';
import { DisposableNodeHolder } from '../DisposableNodeHolder';
import { FileGraph } from '../file-graph/FileGraph';

export class Component extends Entity<ts.ClassDeclaration> {
  declare id: string;
  declare fileName: string;
  declare className: string;

  explicitDeclaration = false;
  qualifier: string | null = null;

  scopeExpression = new DisposableNodeHolder<ts.Expression>();
  lazyExpression = new DisposableNodeHolder<ts.Expression>();

  autowiredRegister = new AutowiredRegister(this);
  lifecycleRegister = new ComponentLifecycleRegister(this);

  constructorDependencies = new Set<Dependency>();
  registerConstructorDependency(dependency: Dependency): void {
    this.constructorDependencies.add(dependency);
    dependency.diType.declarations.map(it => {
      FileGraph.add(this.fileName, it.fileName);
    });
  }

  diType: DIType | null = null;
  registerDIType(diType: DIType): void {
    this.diType = diType;
    diType.declarations.map(it => {
      FileGraph.add(this.fileName, it.fileName);
    });
  }

  get fullName(): string {
    if (this.qualifier !== null) {
      return this.qualifier;
    }

    const firstLower = this.className.at(0)?.toLowerCase() ?? '';

    return `${firstLower}${this.className.slice(1)}`;
  }
}
