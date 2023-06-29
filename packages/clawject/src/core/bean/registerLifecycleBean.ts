import ts from 'typescript';
import { MissingInitializerError } from '../../compilation-context/messages/errors/MissingInitializerError';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { getDecoratorsOnly } from '../ts/utils/getDecoratorsOnly';
import { isDecoratorFromLibrary } from '../ts/predicates/isDecoratorFromLibrary';
import { ClassPropertyWithArrowFunctionInitializer } from '../ts/types';
import { Bean } from './Bean';
import { BeanKind } from './BeanKind';
import { Configuration } from '../configuration/Configuration';
import { getCompilationContext } from '../../transformer/getCompilationContext';
import { LifecycleKind } from '../component-lifecycle/LifecycleKind';

export const registerLifecycleBean = (
    configuration: Configuration,
    classElement: ts.MethodDeclaration | ClassPropertyWithArrowFunctionInitializer,
): void => {
    const compilationContext = getCompilationContext();
    if (ts.isMethodDeclaration(classElement) && !classElement.body) {
        compilationContext.report(new MissingInitializerError(
            'Lifecycle method should have a body.',
            classElement.name,
            configuration.node,
        ));
        return;
    }

    const lifecycles = new Set<LifecycleKind>();
    getDecoratorsOnly(classElement).forEach(it => {
        if (isDecoratorFromLibrary(it, 'PostConstruct')) {
            lifecycles.add(LifecycleKind.POST_CONSTRUCT);
        }
        if (isDecoratorFromLibrary(it, 'BeforeDestruct')) {
            lifecycles.add(LifecycleKind.BEFORE_DESTRUCT);
        }
    });

    if (lifecycles.size === 0) {
        return;
    }

    const bean = new Bean({
        classMemberName: classElement.name.getText(),
        diType: DITypeBuilder.empty(),
        node: classElement,
        kind: ts.isMethodDeclaration(classElement) ? BeanKind.LIFECYCLE_METHOD : BeanKind.LIFECYCLE_ARROW_FUNCTION,
        lifecycle: Array.from(lifecycles),
    });
    configuration.beanRegister.register(bean);
};
