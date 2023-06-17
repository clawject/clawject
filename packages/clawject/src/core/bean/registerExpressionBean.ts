import ts from 'typescript';
import { getPropertyDecoratorBeanInfo } from '../ts/bean-info/getPropertyDecoratorBeanInfo';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { ContextBean } from './ContextBean';
import { BeanKind } from './BeanKind';
import { Context } from '../context/Context';

export const registerExpressionBean = (
    compilationContext: CompilationContext,
    context: Context,
    classElement: ts.PropertyDeclaration,
): void => {
    const beanInfo = getPropertyDecoratorBeanInfo(compilationContext, context, classElement);

    const typeChecker = compilationContext.typeChecker;
    const type = typeChecker.getTypeAtLocation(classElement);
    const diType = DITypeBuilder.build(type, compilationContext);

    const contextBean = new ContextBean({
        context: context,
        classMemberName: classElement.name.getText(),
        diType:  diType,
        node: classElement,
        kind: BeanKind.EXPRESSION,
        scope: beanInfo.scope,
    });
    context.registerBean(contextBean);
};
