import type * as ts from 'typescript';
import { BeanRegister } from '../bean/BeanRegister';
import { Entity } from '../Entity';
import { DisposableNodeHolder } from '../DisposableNodeHolder';
import { ImportRegister } from '../import/ImportRegister';
import { Bean } from '../bean/Bean';
import { BeanKind } from '../bean/BeanKind';

export class Configuration extends Entity<ts.ClassDeclaration> {
  declare id: string;
  declare fileName: string;

  className: string | null = null;
  external: boolean | null = null;

  importRegister = new ImportRegister(this);
  beanRegister = new BeanRegister(this);

  scopeExpression = new DisposableNodeHolder<ts.Expression>();
  lazyExpression = new DisposableNodeHolder<ts.Expression>();

  registerPreDefinedBeans(): void {
    const bean = new Bean({
      kind: BeanKind.PRE_DEFINED,
    });
  }
}
