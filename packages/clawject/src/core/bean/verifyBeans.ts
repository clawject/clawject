import { CompilationContext } from '../../compilation-context/CompilationContext';
import { IncorrectTypeError } from '../../compilation-context/messages/errors/IncorrectTypeError';
import { DITypeFlag } from '../type-system/DITypeFlag';
import { Context } from '../context/Context';
import { BeanKind } from './BeanKind';
import { ContextBean } from './ContextBean';
import { Decorators, isDecoratorFromLibrary } from '../ts/predicates/isDecoratorFromLibrary';
import { DecoratorsCountError } from '../../compilation-context/messages/errors/DecoratorsCountError';
import { getCompilationContext } from '../../transformers/getCompilationContext';

const UNSUPPORTED_TYPES = new Set([
    DITypeFlag.UNSUPPORTED,
    DITypeFlag.NEVER,
    DITypeFlag.UNKNOWN,
    DITypeFlag.VOID,
    DITypeFlag.UNDEFINED,
]);

export const verifyBeans = (compilationContext: CompilationContext, context: Context): void => {
    const contextBeans = context.beans;

    contextBeans.forEach(bean => {
        verifyBeanType(bean);
        verifyDecoratorsCount(bean);
    });
};

function verifyBeanType(bean: ContextBean): void {
    const context = bean.context;
    const compilationContext = getCompilationContext();

    if (bean.kind === BeanKind.LIFECYCLE_METHOD || bean.kind === BeanKind.LIFECYCLE_ARROW_FUNCTION) {
        // Lifecycle methods can return anything
        return;
    }

    if (bean.diType.isUnion) {
        compilationContext.report(new IncorrectTypeError(
            'Union type is not supported as a Bean type.',
            bean.node,
            context.node,
        ));
        context.deregisterBean(bean);
        return;
    }

    if (bean.diType.isArray) {
        compilationContext.report(new IncorrectTypeError(
            'Array type is not supported as a Bean type.',
            bean.node,
            context.node,
        ));
        context.deregisterBean(bean);
        return;
    }

    if (bean.diType.isMapStringToAny) {
        compilationContext.report(new IncorrectTypeError(
            'Map<string, any> type is not supported as a Bean type.',
            bean.node,
            context.node,
        ));
        context.deregisterBean(bean);
        return;
    }

    if (bean.diType.isSet) {
        compilationContext.report(new IncorrectTypeError(
            'Set type is not supported as a Bean type.',
            bean.node,
            context.node,
        ));
        context.deregisterBean(bean);
        return;
    }

    if (UNSUPPORTED_TYPES.has(bean.diType.typeFlag)) {
        compilationContext.report(new IncorrectTypeError(
            'Unsupported type for Bean.',
            bean.node.type ?? bean.node,
            context.node,
        ));
        context.deregisterBean(bean);
        return;
    }
}

function verifyDecoratorsCount(bean: ContextBean): void {
    switch (bean.kind) {
    case BeanKind.METHOD:
    case BeanKind.PROPERTY:
    case BeanKind.ARROW_FUNCTION:
    case BeanKind.EXPRESSION:
        verifyDecoratorsCountOnBean(bean, 'Bean', 1);
        verifyDecoratorsCountOnBean(bean, 'EmbeddedBean', 0);
        verifyDecoratorsCountOnBean(bean, 'PostConstruct', 0);
        verifyDecoratorsCountOnBean(bean, 'BeforeDestruct', 0);
        break;

    case BeanKind.EMBEDDED:
        verifyDecoratorsCountOnBean(bean, 'EmbeddedBean', 1);
        verifyDecoratorsCountOnBean(bean, 'Bean', 0);
        verifyDecoratorsCountOnBean(bean, 'PostConstruct', 0);
        verifyDecoratorsCountOnBean(bean, 'BeforeDestruct', 0);
        break;
    case BeanKind.LIFECYCLE_METHOD:
    case BeanKind.LIFECYCLE_ARROW_FUNCTION:
        verifyDecoratorsCountOnBean(bean, 'PostConstruct', 1);
        verifyDecoratorsCountOnBean(bean, 'BeforeDestruct', 1);
        verifyDecoratorsCountOnBean(bean, 'EmbeddedBean', 0);
        verifyDecoratorsCountOnBean(bean, 'Bean', 0);
        break;
    }
}

function verifyDecoratorsCountOnBean(bean: ContextBean, decorator: Decorators, expectedCount: number): void {
    const compilationContext = getCompilationContext();
    const decorators = bean.node.modifiers?.filter(it => isDecoratorFromLibrary(it, decorator));

    if (!decorators) {
        return;
    }

    if (decorators.length > expectedCount) {
        compilationContext.report(new DecoratorsCountError(
            `${decorator} was used ${decorators.length} times, but expected ${expectedCount}.`,
            decorators?.[0] ?? bean.node,
            bean.context.node,
        ));
    }
}
