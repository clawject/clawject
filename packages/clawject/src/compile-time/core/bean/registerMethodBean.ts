import ts from 'typescript';
import { MissingInitializerError } from '../../compilation-context/messages/errors/MissingInitializerError';
import { TypeQualifyError } from '../../compilation-context/messages/errors/TypeQualifyError';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { Configuration } from '../configuration/Configuration';
import { Bean } from './Bean';
import { BeanKind } from './BeanKind';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { getBeanLazyExpression } from '../ts/bean-info/getBeanLazyExpression';
import { getBeanScopeExpression } from '../ts/bean-info/getBeanScopeExpression';

export const registerMethodBean = (
    configuration: Configuration,
    classElement: ts.MethodDeclaration,
): void => {
    const compilationContext = getCompilationContext();
    if (classElement.body === undefined) {
        compilationContext.report(new MissingInitializerError(
            'Method Bean should have a body.',
            classElement.name,
            configuration.node,
        ));
        return;
    }

    const typeChecker = compilationContext.typeChecker;
    const signature = typeChecker.getSignatureFromDeclaration(classElement);

    if (!signature) {
        compilationContext.report(new TypeQualifyError(
            'Can not resolve method return type.',
            classElement.name,
            configuration.node,
        ));
        return;
    }

    const returnType = typeChecker.getReturnTypeOfSignature(signature);
    const diType = DITypeBuilder.build(returnType);

    const contextBean = new Bean({
        classMemberName: classElement.name.getText(),
        diType: diType,
        node: classElement,
        kind: BeanKind.METHOD,
    });
    contextBean.lazyExpression.node = getBeanLazyExpression(contextBean);
    contextBean.scopeExpression.node = getBeanScopeExpression(contextBean);
    configuration.beanRegister.register(contextBean);
};
