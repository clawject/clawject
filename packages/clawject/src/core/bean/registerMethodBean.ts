import ts from 'typescript';
import { getPropertyDecoratorBeanInfo } from '../ts/bean-info/getPropertyDecoratorBeanInfo';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { MissingInitializerError } from '../../compilation-context/messages/errors/MissingInitializerError';
import { TypeQualifyError } from '../../compilation-context/messages/errors/TypeQualifyError';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { Context } from '../context/Context';
import { ContextBean } from './ContextBean';
import { BeanKind } from './BeanKind';

export const registerMethodBean = (
    compilationContext: CompilationContext,
    context: Context,
    classElement: ts.MethodDeclaration,
): void => {
    if (classElement.body === undefined) {
        compilationContext.report(new MissingInitializerError(
            'Method Bean should have a body.',
            classElement.name,
            context.node,
        ));
        return;
    }

    const beanInfo = getPropertyDecoratorBeanInfo(compilationContext, context, classElement);
    const typeChecker = compilationContext.typeChecker;
    const signature = typeChecker.getSignatureFromDeclaration(classElement);

    if (!signature) {
        compilationContext.report(new TypeQualifyError(
            'Can not resolve method return type.',
            classElement.name,
            context.node,
        ));
        return;
    }

    const returnType = typeChecker.getReturnTypeOfSignature(signature);
    const diType = DITypeBuilder.build(returnType, compilationContext);

    const contextBean  = new ContextBean({
        context: context,
        classMemberName: classElement.name.getText(),
        diType: diType,
        node: classElement,
        kind: BeanKind.METHOD,
        scope: beanInfo.scope,
    });
    context.registerBean(contextBean);
};
