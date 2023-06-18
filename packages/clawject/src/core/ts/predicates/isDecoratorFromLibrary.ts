import ts from 'typescript';
import { getNodeSourceDescriptor } from '../utils/getNodeSourceDescriptor';
import { getCompilationContext } from '../../../transformers/getCompilationContext';

export type Decorators = 'Bean' | 'EmbeddedBean' | 'PostConstruct' | 'BeforeDestruct' | 'Configuration';
const LIBRARY_DECORATORS = new Set<Decorators>([
    'Bean',
    'EmbeddedBean',
    'PostConstruct',
    'BeforeDestruct',
    'Configuration',
]);

export function isDecoratorFromLibrary(decorator: ts.ModifierLike, name: Decorators | undefined): boolean {
    if (!ts.isDecorator(decorator)) {
        return false;
    }

    const compilationContext = getCompilationContext();

    if (ts.isIdentifier(decorator.expression)) {
        const nodeSourceDescriptors = getNodeSourceDescriptor(decorator.expression, compilationContext);

        if (nodeSourceDescriptors === null) {
            return false;
        }

        return nodeSourceDescriptors.every(it => it.isLibraryNode && checkName(it.originalName, name));
    }

    if (ts.isCallExpression(decorator.expression)) {
        const nodeSourceDescriptors = getNodeSourceDescriptor(decorator.expression.expression, compilationContext);

        if (nodeSourceDescriptors === null) {
            return false;
        }

        return nodeSourceDescriptors.every(it => it.isLibraryNode && checkName(it.originalName, name));
    }

    return false;
}

function checkName(name: string | null, decoratorName: Decorators | undefined): boolean {
    if (name === null) {
        return false;
    }

    if (decoratorName === undefined) {
        return LIBRARY_DECORATORS.has(name as any);
    }

    return name === decoratorName;
}
