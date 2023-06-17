import ts from 'typescript';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { registerBeanDependenciesFromParameters } from './registerBeanDependenciesFromParameters';
import { ContextBean } from '../bean/ContextBean';

export const registerMethodBeanDependencies = (
    compilationContext: CompilationContext,
    bean: ContextBean<ts.MethodDeclaration>
) => {
    registerBeanDependenciesFromParameters(bean, bean.node.parameters, compilationContext);
};
