import ts from 'typescript';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { Bean } from './Bean';
import { BeanKind } from './BeanKind';
import { Configuration } from '../configuration/Configuration';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { getBeanLazyExpression } from '../ts/bean-info/getBeanLazyExpression';
import { getBeanScopeExpression } from '../ts/bean-info/getBeanScopeExpression';

export const registerExpressionBean = (
    configuration: Configuration,
    classElement: ts.PropertyDeclaration,
): void => {
    const typeChecker = getCompilationContext().typeChecker;
    const type = typeChecker.getTypeAtLocation(classElement);
    const diType = DITypeBuilder.build(type);

    const contextBean = new Bean({
        classMemberName: classElement.name.getText(),
        diType: diType,
        node: classElement,
        kind: BeanKind.EXPRESSION,
    });
    contextBean.lazyExpression.node = getBeanLazyExpression(contextBean);
    contextBean.scopeExpression.node = getBeanScopeExpression(contextBean);
    configuration.beanRegister.register(contextBean);
};
