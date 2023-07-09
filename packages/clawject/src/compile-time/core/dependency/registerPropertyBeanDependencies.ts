import ts from 'typescript';
import { ClassPropertyWithCallExpressionInitializer } from '../ts/types';
import { registerBeanDependenciesFromParameters } from './registerBeanDependenciesFromParameters';
import { Bean } from '../bean/Bean';

export const registerPropertyBeanDependencies = (bean: Bean<ClassPropertyWithCallExpressionInitializer>) => {
  const classConstructor = bean.classDeclaration?.members.find(ts.isConstructorDeclaration) ?? null;

  if (classConstructor === null) {
    return;
  }

  registerBeanDependenciesFromParameters(bean, classConstructor.parameters);
};
