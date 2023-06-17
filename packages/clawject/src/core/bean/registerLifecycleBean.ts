import { CompilationContext } from '../../compilation-context/CompilationContext';
import ts from 'typescript';
import { MissingInitializerError } from '../../compilation-context/messages/errors/MissingInitializerError';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { getDecoratorsOnly } from '../ts/utils/getDecoratorsOnly';
import { BeanLifecycle } from '../../external/InternalCatContext';
import { isDecoratorFromLibrary } from '../ts/predicates/isDecoratorFromLibrary';
import { ClassPropertyWithArrowFunctionInitializer } from '../ts/types';
import { ContextBean } from './ContextBean';
import { BeanKind } from './BeanKind';
import { Context } from '../context/Context';

export const registerLifecycleBean = (
    compilationContext: CompilationContext,
    context: Context,
    classElement: ts.MethodDeclaration | ClassPropertyWithArrowFunctionInitializer,
): void => {
    if (ts.isMethodDeclaration(classElement) && !classElement.body) {
        compilationContext.report(new MissingInitializerError(
            'Lifecycle method should have a body.',
            classElement.name,
            context.node,
        ));
        return;
    }

    const lifecycles = new Set<BeanLifecycle>();
    getDecoratorsOnly(classElement).forEach(it => {
        if (isDecoratorFromLibrary(it, 'PostConstruct')) {
            lifecycles.add('post-construct');
        }
        if (isDecoratorFromLibrary(it, 'BeforeDestruct')) {
            lifecycles.add('before-destruct');
        }
    });

    if (lifecycles.size === 0) {
        return;
    }

    const contextBean = new ContextBean({
        context:context,
        classMemberName:classElement.name.getText(),
        diType:DITypeBuilder.empty(),
        node:classElement,
        kind: ts.isMethodDeclaration(classElement) ? BeanKind.LIFECYCLE_METHOD : BeanKind.LIFECYCLE_ARROW_FUNCTION,
        lifecycle: Array.from(lifecycles),
    });
    context.registerBean(contextBean);
};
