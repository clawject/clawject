import ts from 'typescript';
import { AutowiredRegister } from '../autowired/AutowiredRegister';
import { Dependency } from '../dependency/Dependency';
import { ComponentLifecycleRegister } from '../component-lifecycle/ComponentLifecycleRegister';
import { BaseElement } from '../BaseElement';

//TODO add stereotype components
export class Component extends BaseElement<ts.ClassDeclaration> {
  declare id: string;
  declare fileName: string;
  declare name: string | null;
  declare explicitDeclaration: boolean;

  autowiredRegister = new AutowiredRegister(this);
  componentLifecycleRegister = new ComponentLifecycleRegister(this);
  constructorDependencies = new Set<Dependency>();
}
