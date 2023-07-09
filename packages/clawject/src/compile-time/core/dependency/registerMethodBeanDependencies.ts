import ts from 'typescript';
import { registerBeanDependenciesFromParameters } from './registerBeanDependenciesFromParameters';
import { Bean } from '../bean/Bean';

export const registerMethodBeanDependencies = (bean: Bean<ts.MethodDeclaration>) => {
  registerBeanDependenciesFromParameters(bean, bean.node.parameters);
};
