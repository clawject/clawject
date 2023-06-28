import ts from 'typescript';
import { getPropertyDecoratorBeanInfo } from '../ts/bean-info/getPropertyDecoratorBeanInfo';
import { MissingInitializerError } from '../../compilation-context/messages/errors/MissingInitializerError';
import { TypeQualifyError } from '../../compilation-context/messages/errors/TypeQualifyError';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { Configuration } from '../configuration/Configuration';
import { Bean } from './Bean';
import { BeanKind } from './BeanKind';
import { getCompilationContext } from '../../transformer/getCompilationContext';

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

    const beanInfo = getPropertyDecoratorBeanInfo(configuration, classElement);
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
        scope: beanInfo.scope,
    });
    configuration.beanRegister.register(contextBean);
};
