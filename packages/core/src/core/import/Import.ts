import type * as ts from 'typescript';
import { PropertyDeclaration } from 'typescript';
import { Entity } from '../Entity';
import { Configuration } from '../configuration/Configuration';
import { DisposableNodeHolder } from '../DisposableNodeHolder';

export class Import extends Entity<PropertyDeclaration> {
  declare id: string;
  declare parentConfiguration: Configuration;
  declare classMemberName: string;
  declare resolvedConfiguration: Configuration;

  external: boolean | null = null;
  lazyExpression = new DisposableNodeHolder<ts.Expression>();

  constructor(values: Partial<Import> = {}) {
    super();

    Object.assign(this, values);
  }
}
