import type * as ts from 'typescript';
import { Entity } from '../Entity';
import { ClassPropertyWithArrowFunctionInitializer } from '../ts/types';
import { LifecycleKind } from '../../../runtime/types/LifecycleKind';

export class ComponentLifecycle extends Entity<ts.MethodDeclaration | ClassPropertyWithArrowFunctionInitializer> {
  declare id: string;
  declare classMemberName: string;
  declare lifecycles: Set<LifecycleKind>;

  constructor(values: Partial<ComponentLifecycle> = {}) {
    super();

    Object.assign(this, values);
  }
}
