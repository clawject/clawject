import ts from 'typescript';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { Bean } from '../bean/Bean';
import { Dependency } from './Dependency';
import { getCompilationContext } from '../../transformers/getCompilationContext';

export const registerBeanDependenciesFromParameters = (
    bean: Bean,
    parameters: ts.NodeArray<ts.ParameterDeclaration>,
): void => {
    const typeChecker = getCompilationContext().typeChecker;

    parameters.forEach(parameter => {
        const parameterType = typeChecker.getTypeAtLocation(parameter);
        const diType = DITypeBuilder.build(parameterType);

        const dependency = new Dependency();
        bean.dependencies.add(dependency);

        dependency.parameterName = parameter.name.getText();
        dependency.diType = diType;
        dependency.node = parameter;
    });
};
