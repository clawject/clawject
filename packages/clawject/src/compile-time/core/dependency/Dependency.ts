import ts from 'typescript';
import { DIType } from '../type-system/DIType';
import { Entity } from '../Entity';

export class Dependency extends Entity<ts.ParameterDeclaration | ts.PropertyDeclaration> {
  declare parameterName: string;
  declare diType: DIType;
}
