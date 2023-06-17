import ts from 'typescript';
import { ClassPropertyWithCallExpressionInitializer } from '../types';
import { CompilationContext } from '../../../compilation-context/CompilationContext';
import { getNodeSourceDescriptor } from '../utils/getNodeSourceDescriptor';
import { unwrapExpressionFromRoundBrackets } from '../utils/unwrapExpressionFromRoundBrackets';

export const isClassPropertyBean = (node: ts.Node, compilationContext: CompilationContext): node is ClassPropertyWithCallExpressionInitializer =>
    ts.isPropertyDeclaration(node) && hasBeanCallExpression(node, compilationContext);

function hasBeanCallExpression(node: ts.PropertyDeclaration, compilationContext: CompilationContext): boolean {
    let initializer = node.initializer;

    if (initializer === undefined) {
        return false;
    }

    initializer = unwrapExpressionFromRoundBrackets(initializer);

    if (!ts.isCallExpression(initializer)) {
        return false;
    }

    const nodeSourceDescriptors = getNodeSourceDescriptor(initializer.expression, compilationContext);

    if (nodeSourceDescriptors === null) {
        return false;
    }

    return nodeSourceDescriptors.every(it => it.isLibraryNode && it.originalName === 'Bean');
}
