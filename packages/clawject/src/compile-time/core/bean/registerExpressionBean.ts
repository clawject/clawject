import ts from 'typescript';
import { getPropertyDecoratorBeanInfo } from '../ts/bean-info/getPropertyDecoratorBeanInfo';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { Bean } from './Bean';
import { BeanKind } from './BeanKind';
import { Configuration } from '../configuration/Configuration';
import { getCompilationContext } from '../../../transformer/getCompilationContext';

export const registerExpressionBean = (
    configuration: Configuration,
    classElement: ts.PropertyDeclaration,
): void => {
    const beanInfo = getPropertyDecoratorBeanInfo(configuration, classElement);

    const typeChecker = getCompilationContext().typeChecker;
    const type = typeChecker.getTypeAtLocation(classElement);
    const diType = DITypeBuilder.build(type);

    const contextBean = new Bean({
        classMemberName: classElement.name.getText(),
        diType: diType,
        node: classElement,
        kind: BeanKind.EXPRESSION,
        scope: beanInfo.scope,
        lazy: beanInfo.lazy,
    });
    configuration.beanRegister.register(contextBean);
};
