import ts from 'typescript';
import { DIType } from '../type-system/DIType';
import { Bean } from '../bean/Bean';

export class Dependency {
    declare parameterName: string;
    declare diType: DIType;
    declare node: ts.ParameterDeclaration;

    qualifiedBean: Bean | null = null;
    /**
     * For array, map, set
     * */
    qualifiedBeans: Bean[] | null = null;
}
