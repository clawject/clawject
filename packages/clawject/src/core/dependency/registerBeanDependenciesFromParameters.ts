import ts from 'typescript';
import { Bean } from '../bean/Bean';
import { buildDependencyFromParameter } from './buildDependencyFromParameter';

export const registerBeanDependenciesFromParameters = (
    bean: Bean,
    parameters: ts.NodeArray<ts.ParameterDeclaration>,
): void => {
    parameters.forEach(parameter => {
        const dependency = buildDependencyFromParameter(parameter);

        bean.constructorDependencies.add(dependency);
    });
};
