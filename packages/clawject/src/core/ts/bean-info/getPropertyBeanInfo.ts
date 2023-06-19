import ts from 'typescript';
import { getScopeValue } from './getScopeValue';
import { ClassPropertyWithCallExpressionInitializer } from '../types';
import { ICompilationBeanInfo } from './ICompilationBeanInfo';
import { CompilationContext } from '../../../compilation-context/CompilationContext';
import { IncorrectArgumentsLengthError } from '../../../compilation-context/messages/errors/IncorrectArgumentsLengthError';
import { IncorrectArgumentError } from '../../../compilation-context/messages/errors/IncorrectArgumentError';
import { Configuration } from '../../configuration/Configuration';
import { BeanScope } from '../../bean/BeanScope';
import { unwrapExpressionFromRoundBrackets } from '../utils/unwrapExpressionFromRoundBrackets';

export function getPropertyBeanInfo(
    compilationContext: CompilationContext,
    configuration: Configuration,
    propertyDeclaration: ClassPropertyWithCallExpressionInitializer
): ICompilationBeanInfo {
    const beanCall = unwrapExpressionFromRoundBrackets(propertyDeclaration.initializer);

    if (beanCall.arguments.length === 0) {
        compilationContext.report(new IncorrectArgumentsLengthError(
            null,
            propertyDeclaration,
            configuration.node,
        ));

        return {
            scope: BeanScope.SINGLETON,
        };
    }

    const secondArg = beanCall.arguments[1];

    if (secondArg === undefined) {
        return {
            scope: BeanScope.SINGLETON,
        };
    }

    if (!ts.isObjectLiteralExpression(secondArg)) {
        //TODO try to resolve value with typechecker
        compilationContext.report(new IncorrectArgumentError(
            'Configuration object should be an object literal.',
            secondArg,
            configuration.node,
        ));

        return {
            scope: BeanScope.SINGLETON,
        };
    }

    return {
        scope: getScopeValue(compilationContext, configuration, secondArg),
    };
}
