import ts from 'typescript';
import { Context } from '../context/Context';
import { DIType } from '../type-system/DIType';
import { ContextBean } from '../bean/ContextBean';

export class BeanDependency {
    declare parameterName: string;
    declare context: Context;
    declare diType: DIType;
    declare node: ts.ParameterDeclaration;

    qualifiedBean: ContextBean | null = null;
    /**
     * For array, map, set
     * */
    qualifiedBeans: ContextBean[] | null = null;
}
