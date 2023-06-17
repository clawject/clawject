import ts from 'typescript';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { ContextBean } from '../bean/ContextBean';
import { BeanDependency } from './BeanDependency';

export const registerBeanDependenciesFromParameters = (
    bean: ContextBean,
    parameters: ts.NodeArray<ts.ParameterDeclaration>,
    compilationContext: CompilationContext
): void => {
    const typeChecker = compilationContext.typeChecker;

    parameters.forEach(parameter => {
        const parameterType = typeChecker.getTypeAtLocation(parameter);
        const diType = DITypeBuilder.build(parameterType, compilationContext);

        const dependency = new BeanDependency();
        bean.dependencies.add(dependency);

        dependency.parameterName = parameter.name.getText();
        dependency.context = bean.context;
        dependency.diType = diType;
        dependency.node = parameter;
    });
};
