import ts from 'typescript';
import { unquoteString } from '../../utils/unquoteString';
import { CompilationContext } from '../../../compilation-context/CompilationContext';
import { IncorrectArgumentError } from '../../../compilation-context/messages/errors/IncorrectArgumentError';
import { Configuration } from '../../configuration/Configuration';
import { BeanScope } from '../../../../runtime/decorators/Bean';

export const getScopeValue = (
    compilationContext: CompilationContext,
    configuration: Configuration,
    expression: ts.ObjectLiteralExpression
): BeanScope => {
    const scopeNode = expression.properties.find(it => it.name?.getText() === 'scope');

    if (scopeNode === undefined) {
        return 'singleton';
    }

    if (ts.isPropertyAssignment(scopeNode)) {
        if (!ts.isStringLiteral(scopeNode.initializer)) {
            compilationContext.report(new IncorrectArgumentError(
                'Bean scope value should be statically known string literal.',
                scopeNode,
                configuration.node,
            ));
            return 'singleton';
        }

        return unquoteString(scopeNode.initializer.getText());
    }

    return 'singleton';
};
