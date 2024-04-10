import type * as ts from 'typescript';
import { ComponentLifecycleRegister } from '../component-lifecycle/ComponentLifecycleRegister';
import { Entity } from '../Entity';

export class Component extends Entity<ts.ClassDeclaration> {
  declare id: string;
  declare fileName: string;
  declare className: string;

  explicitDeclaration = false;
  qualifier: string | null = null;

  lifecycleRegister = new ComponentLifecycleRegister(this);
}
