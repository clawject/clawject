import ts from 'typescript';
import { Dependency } from './Dependency';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { getCompilationContext } from '../../../transformer/getCompilationContext';

export const buildDependencyFromParameter = (parameter: ts.ParameterDeclaration): Dependency => {
  const parameterType = getCompilationContext().typeChecker.getTypeAtLocation(parameter);
  const diType = DITypeBuilder.build(parameterType);

  const dependency = new Dependency();
  dependency.parameterName = parameter.name.getText();
  dependency.diType = diType;
  dependency.node = parameter;

  return dependency;
};
