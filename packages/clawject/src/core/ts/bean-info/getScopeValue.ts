import ts from 'typescript';
import { unquoteString } from '../../utils/unquoteString';
import { CompilationContext } from '../../../compilation-context/CompilationContext';
import { IncorrectArgumentError } from '../../../compilation-context/messages/errors/IncorrectArgumentError';
import { BeanScope } from '../../bean/BeanScope';
import { Context } from '../../context/Context';

export const getScopeValue = (
    compilationContext: CompilationContext,
    context: Context,
    expression: ts.ObjectLiteralExpression
): BeanScope => {
    const scopeNode = expression.properties.find(it => it.name?.getText() === 'scope');

    if (scopeNode === undefined) {
        return BeanScope.SINGLETON;
    }

    let scopeValue: string | null = null;

    if (ts.isPropertyAssignment(scopeNode)) {
        if (!ts.isStringLiteral(scopeNode.initializer)) {
            compilationContext.report(new IncorrectArgumentError(
                'Bean scope value should be a string literal.',
                scopeNode,
                context.node,
            ));
            return BeanScope.SINGLETON;
        }

        scopeValue = unquoteString(scopeNode.initializer.getText());
    }

    if (scopeValue === BeanScope.SINGLETON || scopeValue === BeanScope.PROTOTYPE) {
        return scopeValue;
    }

    compilationContext.report(new IncorrectArgumentError(
        'Bean scope value should be a a "prototype" or "singleton".',
        scopeNode,
        context.node,
    ));

    return BeanScope.SINGLETON;
};
