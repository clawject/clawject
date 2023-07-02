import { IncorrectTypeError } from '../../compilation-context/messages/errors/IncorrectTypeError';
import { DITypeFlag } from '../type-system/DITypeFlag';
import { Configuration } from '../configuration/Configuration';
import { BeanKind } from './BeanKind';
import { Bean } from './Bean';
import { Decorators, isDecoratorFromLibrary } from '../ts/predicates/isDecoratorFromLibrary';
import { DecoratorsCountError } from '../../compilation-context/messages/errors/DecoratorsCountError';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { NotSupportedError } from '../../compilation-context/messages/errors/NotSupportedError';
import { isStaticallyKnownPropertyName } from '../ts/predicates/isStaticallyKnownPropertyName';
import ts from 'typescript';
import chalk from 'chalk';

const UNSUPPORTED_TYPES = new Set([
    DITypeFlag.UNSUPPORTED,
    DITypeFlag.NEVER,
    DITypeFlag.VOID,
    DITypeFlag.UNDEFINED,
]);
const RESTRICTED_MODIFIERS = new Map<ts.SyntaxKind, string>([
    [ts.SyntaxKind.AbstractKeyword, 'abstract'],
    [ts.SyntaxKind.StaticKeyword, 'static'],
    [ts.SyntaxKind.DeclareKeyword, 'declare'],
]);

export const verifyBeans = (configuration: Configuration): void => {
    const beans = configuration.beanRegister.elements;

    beans.forEach(bean => {
        verifyAllowedBeanKinds(bean);
        verifyBeanType(bean);
        verifyDecoratorsCount(bean);
        verifyName(bean);
        verifyModifiers(bean);
    });
};

function verifyBeanType(bean: Bean): void {
    const parentConfiguration = bean.parentConfiguration;
    const compilationContext = getCompilationContext();

    if (bean.isLifecycle()) {
        // Lifecycle methods can return anything
        return;
    }

    if (bean.diType.isUnion) {
        compilationContext.report(new IncorrectTypeError(
            'Union type is not supported as a Bean type.',
            bean.node,
            parentConfiguration.node,
        ));
        parentConfiguration.beanRegister.deregister(bean);
        return;
    }

    if (bean.diType.isArray) {
        compilationContext.report(new IncorrectTypeError(
            'Array type is not supported as a Bean type.',
            bean.node,
            parentConfiguration.node,
        ));
        parentConfiguration.beanRegister.deregister(bean);
        return;
    }

    if (bean.diType.isMapStringToAny) {
        compilationContext.report(new IncorrectTypeError(
            'Map<string, any> type is not supported as a Bean type.',
            bean.node,
            parentConfiguration.node,
        ));
        parentConfiguration.beanRegister.deregister(bean);
        return;
    }

    if (bean.diType.isSet) {
        compilationContext.report(new IncorrectTypeError(
            'Set type is not supported as a Bean type.',
            bean.node,
            parentConfiguration.node,
        ));
        parentConfiguration.beanRegister.deregister(bean);
        return;
    }

    if (UNSUPPORTED_TYPES.has(bean.diType.typeFlag)) {
        compilationContext.report(new IncorrectTypeError(
            'Unsupported type for Bean.',
            bean.node.type ?? bean.node,
            parentConfiguration.node,
        ));
        parentConfiguration.beanRegister.deregister(bean);
        return;
    }
}

function verifyDecoratorsCount(bean: Bean): void {
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

function verifyDecoratorsCountOnBean(bean: Bean, decorator: Decorators, expectedCount: number): void {
    const compilationContext = getCompilationContext();
    const decorators = bean.node.modifiers?.filter(it => isDecoratorFromLibrary(it, decorator));

    if (!decorators) {
        return;
    }

    if (decorators.length > expectedCount) {
        compilationContext.report(new DecoratorsCountError(
            `${decorator} was used ${decorators.length} times, but expected ${expectedCount}.`,
            decorators?.[0] ?? bean.node,
            bean.parentConfiguration.node,
        ));
        bean.parentConfiguration.beanRegister.deregister(bean);
    }
}

function verifyAllowedBeanKinds(bean: Bean): void {
    const compilationContext = getCompilationContext();

    if (!bean.parentConfiguration.allowedBeanKinds.has(bean.kind)) {
        compilationContext.report(new NotSupportedError(
            'Bean',
            bean.node,
            bean.parentConfiguration.node
        ));
        bean.parentConfiguration.beanRegister.deregister(bean);
    }
}

function verifyName(bean: Bean): void {
    const compilationContext = getCompilationContext();
    const name = bean.node.name;

    if (isStaticallyKnownPropertyName(name)) {
        return;
    }

    compilationContext.report(new NotSupportedError(
        'Bean property name should be statically known.',
        bean.node.name,
        bean.parentConfiguration.node
    ));
    bean.parentConfiguration.beanRegister.deregister(bean);
}

function verifyModifiers(bean: Bean): void {
    const compilationContext = getCompilationContext();
    const restrictedModifier = bean.node.modifiers?.find(it => RESTRICTED_MODIFIERS.has(it.kind));

    if (!restrictedModifier) {
        return;
    }

    compilationContext.report(new NotSupportedError(
        `Bean declaration should not have modifier ${chalk.bold(RESTRICTED_MODIFIERS.get(restrictedModifier.kind))}.`,
        bean.node.name,
        bean.parentConfiguration.node
    ));
    bean.parentConfiguration.beanRegister.deregister(bean);
}
