import ts from 'typescript';
import { getNodeSourceDescriptor } from '../utils/getNodeSourceDescriptor';

export type Decorators =
    'Bean' |
    'EmbeddedBean' |
    'PostConstruct' |
    'BeforeDestruct' |
    'Configuration' |
    'Component' |
    'Lazy' |
    'Scope' |
    'Autowired';
const LIBRARY_DECORATORS = new Set<Decorators>([
    'Bean',
    'EmbeddedBean',
    'PostConstruct',
    'BeforeDestruct',
    'Configuration',
    'Component',
    'Lazy',
    'Scope',
    'Autowired',
]);

export function isDecoratorFromLibrary(decorator: ts.ModifierLike, name: Decorators | undefined): boolean {
    if (!ts.isDecorator(decorator)) {
        return false;
    }

    if (ts.isIdentifier(decorator.expression)) {
        const nodeSourceDescriptors = getNodeSourceDescriptor(decorator.expression);

        if (nodeSourceDescriptors === null) {
            return false;
        }

        return nodeSourceDescriptors.every(it => it.isLibraryNode && checkName(it.originalName, name));
    }

    if (ts.isCallExpression(decorator.expression)) {
        const nodeSourceDescriptors = getNodeSourceDescriptor(decorator.expression.expression);

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
