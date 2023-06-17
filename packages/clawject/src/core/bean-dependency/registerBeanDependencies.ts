import ts from 'typescript';
import { registerMethodBeanDependencies } from './registerMethodBeanDependencies';
import { registerPropertyBeanDependencies } from './registerPropertyBeanDependencies';
import { ClassPropertyWithArrowFunctionInitializer, ClassPropertyWithCallExpressionInitializer } from '../ts/types';
import { registerArrowFunctionBeanDependencies } from './registerArrowFunctionBeanDependencies';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { Context } from '../context/Context';
import { BeanKind } from '../bean/BeanKind';
import { ContextBean } from '../bean/ContextBean';

export const registerBeanDependencies = (
    compilationContext: CompilationContext,
    context: Context,
) => {
    context.beans.forEach(bean => {
        switch (bean.kind) {
        case BeanKind.PROPERTY:
            registerPropertyBeanDependencies(compilationContext, bean as ContextBean<ClassPropertyWithCallExpressionInitializer>);
            break;

        case BeanKind.METHOD:
        case BeanKind.LIFECYCLE_METHOD:
            registerMethodBeanDependencies(compilationContext, bean as ContextBean<ts.MethodDeclaration>);
            break;

        case BeanKind.ARROW_FUNCTION:
        case BeanKind.LIFECYCLE_ARROW_FUNCTION:
            registerArrowFunctionBeanDependencies(compilationContext, bean as ContextBean<ClassPropertyWithArrowFunctionInitializer>);
            break;
        }
    });
};
