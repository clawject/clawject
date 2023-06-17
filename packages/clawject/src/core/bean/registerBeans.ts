import { isMethodBean } from '../ts/predicates/isMethodBean';
import { registerMethodBean } from './registerMethodBean';
import { isClassPropertyBean } from '../ts/predicates/isClassPropertyBean';
import { registerPropertyBean } from './registerPropertyBean';
import { isArrowFunctionBean } from '../ts/predicates/isArrowFunctionBean';
import { registerArrowFunctionBean } from './registerArrowFunctionBean';
import { isExpressionBean } from '../ts/predicates/isExpressionBean';
import { registerExpressionBean } from './registerExpressionBean';
import { isEmbeddedBean } from '../ts/predicates/isEmbeddedBean';
import { registerEmbeddedBean } from './registerEmbeddedBeans';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { verifyBeans } from './verifyBeans';
import { isLifecycleMethodBean } from '../ts/predicates/isLifecycleMethodBean';
import { registerLifecycleBean } from './registerLifecycleBean';
import { isLifecycleArrowFunctionBean } from '../ts/predicates/isLifecycleArrowFunctionBean';
import { Context } from '../context/Context';

export function registerBeans(compilationContext: CompilationContext, context: Context): void {
    context.node.members.forEach((classElement) => {
        if (isMethodBean(classElement)) {
            registerMethodBean(compilationContext, context, classElement);
        }
        if (isClassPropertyBean(classElement, compilationContext)) {
            registerPropertyBean(compilationContext, context, classElement);
        }
        if (isArrowFunctionBean(compilationContext, context, classElement)) {
            registerArrowFunctionBean(compilationContext, context, classElement);
        }
        if (isExpressionBean(compilationContext, context, classElement)) {
            registerExpressionBean(compilationContext, context, classElement);
        }
        if (isEmbeddedBean(compilationContext, context, classElement)) {
            registerEmbeddedBean(compilationContext, context, classElement);
        }
        if (isLifecycleMethodBean(classElement) || isLifecycleArrowFunctionBean(compilationContext, context, classElement)) {
            registerLifecycleBean(compilationContext, context, classElement);
        }
    });

    verifyBeans(compilationContext, context);
}
