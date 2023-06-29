import ts from 'typescript';
import { getScopeValue } from './getScopeValue';
import { ClassPropertyWithCallExpressionInitializer } from '../types';
import { CompilationContext } from '../../../compilation-context/CompilationContext';
import { IncorrectArgumentsLengthError } from '../../../compilation-context/messages/errors/IncorrectArgumentsLengthError';
import { IncorrectArgumentError } from '../../../compilation-context/messages/errors/IncorrectArgumentError';
import { Configuration } from '../../configuration/Configuration';
import { unwrapExpressionFromRoundBrackets } from '../utils/unwrapExpressionFromRoundBrackets';
import { BeanConfig } from '../../../external/Bean';
import { ConfigLoader } from '../../../config/ConfigLoader';
import { getLazyInitValue } from './getLazyInitValue';

export function getPropertyBeanInfo(
    compilationContext: CompilationContext,
    configuration: Configuration,
    propertyDeclaration: ClassPropertyWithCallExpressionInitializer
): Required<BeanConfig> {
    const beanCall = unwrapExpressionFromRoundBrackets(propertyDeclaration.initializer);

    if (beanCall.arguments.length === 0) {
        compilationContext.report(new IncorrectArgumentsLengthError(
            null,
            propertyDeclaration,
            configuration.node,
        ));

        return {
            scope: 'singleton',
            lazy: ConfigLoader.get().features.lazyBeans,
        };
    }

    const secondArg = beanCall.arguments[1];

    if (secondArg === undefined) {
        return {
            scope: 'singleton',
            lazy: ConfigLoader.get().features.lazyBeans,
        };
    }

    if (!ts.isObjectLiteralExpression(secondArg)) {
        compilationContext.report(new IncorrectArgumentError(
            'Configuration object should be an object literal with statically known members and values.',
            secondArg,
            configuration.node,
        ));

        return {
            scope: 'singleton',
            lazy: ConfigLoader.get().features.lazyBeans,
        };
    }

    return {
        scope: getScopeValue(compilationContext, configuration, secondArg),
        lazy: getLazyInitValue(compilationContext, configuration, secondArg),
    };
}
