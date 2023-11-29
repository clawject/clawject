import ts from 'typescript';
import { DIType } from '../type-system/DIType';
import { Bean } from '../bean/Bean';
import { Entity } from '../Entity';

export class Dependency extends Entity<ts.ParameterDeclaration> {
  declare parameterName: string;
  declare diType: DIType;

  qualifiedBean: Bean | null = null;
  /**
   * For array, map, set or in application mode
   * */
  qualifiedCollectionBeans: Bean[] | null = null;
}
