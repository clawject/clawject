import ts from 'typescript';
import { DIType } from '../type-system/DIType';
import { Bean } from '../bean/Bean';
import { BaseElement } from '../BaseElement';

export class Dependency extends BaseElement<ts.ParameterDeclaration> {
  declare parameterName: string;
  declare diType: DIType;

  qualifiedBean: DependencyQualifiedBean | null = null;
  /**
   * For array, map, set
   * */
  qualifiedBeans: DependencyQualifiedBean[] | null = null;
}

export class DependencyQualifiedBean {
  constructor(
    public bean: Bean,
    public embeddedName: string | null = null,
  ) {
  }

  get fullName(): string {
    if (this.embeddedName === null) {
      return this.bean.classMemberName;
    }

    return this.bean.fullName + '.' + this.embeddedName;
  }
}
