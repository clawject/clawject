import type * as ts from 'typescript';
import { Entity } from '../Entity';
import { CType } from '../type-system/CType';

export class Dependency extends Entity<ts.ParameterDeclaration | ts.PropertyDeclaration> {
  declare parameterName: string;
  private _cType: CType | null = null;

  get cType(): CType {
    if (this._cType === null) {
      throw new Error('DIType of dependency is not initialized');
    }
    return this._cType;
  }

  set cType(cType: CType) {
    this._cType = cType;
  }
}
