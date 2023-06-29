import ts from 'typescript';
import { getScopeValue } from './getScopeValue';
import { isDecoratorFromLibrary } from '../predicates/isDecoratorFromLibrary';
import { ClassPropertyWithArrowFunctionInitializer } from '../types';
import { UnknownError } from '../../../compilation-context/messages/errors/UnknownError';
import { IncorrectArgumentError } from '../../../compilation-context/messages/errors/IncorrectArgumentError';
import { getDecoratorsOnly } from '../utils/getDecoratorsOnly';
import { Configuration } from '../../configuration/Configuration';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { BeanConfig } from '../../../external/Bean';
import { ConfigLoader } from '../../../config/ConfigLoader';
import { getLazyInitValue } from './getLazyInitValue';

export const getPropertyDecoratorBeanInfo = (
    configuration: Configuration,
    node: ts.MethodDeclaration | ClassPropertyWithArrowFunctionInitializer | ts.PropertyDeclaration
): Required<BeanConfig> => {
    const compilationContext = getCompilationContext();
    const bean = getDecoratorsOnly(node)
        .find(it => isDecoratorFromLibrary(it, 'Bean')) ?? null;

    if (bean === null) {
        compilationContext.report(new UnknownError(
            'Bean do not have @Bean decorator.',
            node,
            configuration.node,
        ));

        return {
            scope: 'singleton',
            lazy: ConfigLoader.get().features.lazyBeans,
        };
    }

    const expression = bean.expression;

    if (ts.isIdentifier(expression)) {
        return {
            scope: 'singleton',
            lazy: ConfigLoader.get().features.lazyBeans,
        };
    }

    if (ts.isCallExpression(expression)) {
        const firstArg = expression.arguments[0];

        if (!ts.isObjectLiteralExpression(firstArg)) {
            compilationContext.report(new IncorrectArgumentError(
                'Configuration object should be an object literal with statically known members and values.',
                firstArg,
                configuration.node,
            ));

            return {
                scope: 'singleton',
                lazy: ConfigLoader.get().features.lazyBeans,
            };
        }

        return {
            scope: getScopeValue(compilationContext, configuration, firstArg),
            lazy: getLazyInitValue(compilationContext, configuration, firstArg),
        };
    }

    return {
        scope: 'singleton',
        lazy: ConfigLoader.get().features.lazyBeans,
    };
};
