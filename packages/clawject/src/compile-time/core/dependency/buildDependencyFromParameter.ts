import ts from 'typescript';
import { Dependency } from './Dependency';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { Bean } from '../bean/Bean';
import { Autowired } from '../autowired/Autowired';
import { Component } from '../component/Component';

export const buildDependencyFromParameter = (parameter: ts.ParameterDeclaration, element: Bean | Component): Dependency => {
  const parameterType = getCompilationContext().typeChecker.getTypeAtLocation(parameter);
  const diType = DITypeBuilder.buildForClassDependency(parameterType, element.genericSymbolLookupTable);

  const dependency = new Dependency();
  dependency.parameterName = parameter.name.getText();
  dependency.diType = diType;
  dependency.node = parameter;

  return dependency;
};
