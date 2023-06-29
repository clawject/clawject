import ts, { SyntaxKind } from 'typescript';
import { CompilationContext } from '../../../compilation-context/CompilationContext';
import { IncorrectArgumentError } from '../../../compilation-context/messages/errors/IncorrectArgumentError';
import { Configuration } from '../../configuration/Configuration';
import { ConfigLoader } from '../../../config/ConfigLoader';

export const getLazyInitValue = (
    compilationContext: CompilationContext,
    configuration: Configuration,
    expression: ts.ObjectLiteralExpression
): boolean => {
    const lazyInitNode = expression.properties.find(it => it.name?.getText() === 'lazy');

    if (lazyInitNode === undefined) {
        return ConfigLoader.get().features.lazyBeans;
    }

    if (ts.isPropertyAssignment(lazyInitNode)) {
        if (lazyInitNode.initializer.kind === SyntaxKind.TrueKeyword) {
            return true;
        }

        if (lazyInitNode.initializer.kind === SyntaxKind.FalseKeyword) {
            return false;
        }
    }

    compilationContext.report(new IncorrectArgumentError(
        'Bean lazy value should be a boolean literal.',
        lazyInitNode,
        configuration.node,
    ));

    return ConfigLoader.get().features.lazyBeans;
};
