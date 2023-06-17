import { getPropertyDecoratorBeanInfo } from '../ts/bean-info/getPropertyDecoratorBeanInfo';
import { ClassPropertyWithArrowFunctionInitializer } from '../ts/types';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { TypeQualifyError } from '../../compilation-context/messages/errors/TypeQualifyError';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { ContextBean } from './ContextBean';
import { BeanKind } from './BeanKind';
import { Context } from '../context/Context';
import { unwrapExpressionFromRoundBrackets } from '../ts/utils/unwrapExpressionFromRoundBrackets';
import ts from 'typescript';

export const registerArrowFunctionBean = (
    compilationContext: CompilationContext,
    context: Context,
    classElement: ClassPropertyWithArrowFunctionInitializer,
): void => {
    const beanInfo = getPropertyDecoratorBeanInfo(compilationContext, context, classElement);

    const typeChecker = compilationContext.typeChecker;
    const signature = typeChecker.getSignatureFromDeclaration(unwrapExpressionFromRoundBrackets(classElement.initializer));
    if (!signature) {
        compilationContext.report(new TypeQualifyError(
            'Can not resolve function return type.',
            classElement.initializer,
            context.node,
        ));
        return;
    }

    const returnType = typeChecker.getReturnTypeOfSignature(signature);
    const diType = DITypeBuilder.build(returnType, compilationContext);

    const contextBean = new ContextBean({
        context: context,
        classMemberName: classElement.name.getText(),
        diType: diType,
        node: classElement,
        kind: BeanKind.ARROW_FUNCTION,
        scope: beanInfo.scope,
    });
    context.registerBean(contextBean);
};
