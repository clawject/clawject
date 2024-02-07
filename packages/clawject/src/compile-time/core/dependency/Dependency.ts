import ts from 'typescript';
import { DIType } from '../type-system/DIType';
import { Entity } from '../Entity';

export class Dependency extends Entity<ts.ParameterDeclaration | ts.PropertyDeclaration> {
  declare parameterName: string;
  private _diType: DIType | null = null;

  get diType(): DIType {
    if (this._diType === null) {
      throw new Error('DIType of dependency is not initialized');
    }
    return this._diType;
  }

  set diType(diType: DIType) {
    this._diType = diType;
  }
}
