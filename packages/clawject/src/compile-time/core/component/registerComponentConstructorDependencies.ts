import ts from 'typescript';
import { Component } from './Component';
import { buildDependencyFromParameter } from '../dependency/buildDependencyFromParameter';

export const registerComponentConstructorDependencies = (component: Component) => {
  const constructorDeclaration = component.node.members.find(ts.isConstructorDeclaration);

  constructorDeclaration?.parameters.forEach(parameter => {
    const dependency = buildDependencyFromParameter(parameter, component);

    component.registerConstructorDependency(dependency);
  });
};
