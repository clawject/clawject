import ts from 'typescript';
import { getScopeValue } from './getScopeValue';
import { isDecoratorFromLibrary } from '../predicates/isDecoratorFromLibrary';
import { ICompilationBeanInfo } from './ICompilationBeanInfo';
import { ClassPropertyWithArrowFunctionInitializer } from '../types';
import { CompilationContext } from '../../../compilation-context/CompilationContext';
import { UnknownError } from '../../../compilation-context/messages/errors/UnknownError';
import { IncorrectArgumentError } from '../../../compilation-context/messages/errors/IncorrectArgumentError';
import { getDecoratorsOnly } from '../utils/getDecoratorsOnly';
import { BeanScope } from '../../bean/BeanScope';
import { Context } from '../../context/Context';

export const getPropertyDecoratorBeanInfo = (
    compilationContext: CompilationContext,
    context: Context,
    node: ts.MethodDeclaration | ClassPropertyWithArrowFunctionInitializer | ts.PropertyDeclaration
): ICompilationBeanInfo => {
    const bean = getDecoratorsOnly(node)
        .find(it => isDecoratorFromLibrary(it, 'Bean')) ?? null;

    if (bean === null) {
        compilationContext.report(new UnknownError(
            'Bean do not have @Bean decorator.',
            node,
            context.node,
        ));

        return {
            scope: BeanScope.SINGLETON,
        };
    }

    const expression = bean.expression;

    if (ts.isIdentifier(expression)) {
        return {
            scope: BeanScope.SINGLETON,
        };
    }

    if (ts.isCallExpression(expression)) {
        const firstArg = expression.arguments[0];

        if (!ts.isObjectLiteralExpression(firstArg)) {
            //TODO try to resolve value with typechecker
            compilationContext.report(new IncorrectArgumentError(
                'Configuration object should be an object literal.',
                firstArg,
                context.node,
            ));

            return {
                scope: BeanScope.SINGLETON,
            };
        }

        return {
            scope: getScopeValue(compilationContext, context, firstArg),
        };
    }

    return {
        scope: BeanScope.SINGLETON,
    };
};
