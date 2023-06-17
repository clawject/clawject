import ts from 'typescript';
import { ClassPropertyWithCallExpressionInitializer } from '../ts/types';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { registerBeanDependenciesFromParameters } from './registerBeanDependenciesFromParameters';
import { ContextBean } from '../bean/ContextBean';

export const registerPropertyBeanDependencies = (
    compilationContext: CompilationContext,
    bean: ContextBean<ClassPropertyWithCallExpressionInitializer>
) => {
    const classConstructor = bean.classDeclaration?.members.find(ts.isConstructorDeclaration) ?? null;

    if (classConstructor === null) {
        return;
    }

    registerBeanDependenciesFromParameters(bean, classConstructor.parameters, compilationContext);
};
