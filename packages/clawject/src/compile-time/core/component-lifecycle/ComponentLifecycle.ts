import ts from 'typescript';
import { BaseElement } from '../BaseElement';
import { ClassPropertyWithArrowFunctionInitializer } from '../ts/types';
import { LifecycleKind } from './LifecycleKind';

export class ComponentLifecycle extends BaseElement<ts.MethodDeclaration | ClassPropertyWithArrowFunctionInitializer> {
  declare id: string;
  declare classMemberName: string;
  declare lifecycles: Set<LifecycleKind>;

  constructor(values: Partial<ComponentLifecycle> = {}) {
    super();

    Object.assign(this, values);
  }
}