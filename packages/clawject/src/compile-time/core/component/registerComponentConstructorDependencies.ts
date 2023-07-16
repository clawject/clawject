import ts from 'typescript';
import { Component } from './Component';
import { buildDependencyFromParameter } from '../dependency/buildDependencyFromParameter';
import { FileGraph } from '../file-graph/FileGraph';

export const registerComponentConstructorDependencies = (component: Component) => {
  const constructorDeclaration = component.node.members.find(ts.isConstructorDeclaration);

  constructorDeclaration?.parameters.forEach(parameter => {
    const dependency = buildDependencyFromParameter(parameter);

    component.constructorDependencies.add(dependency);

    dependency.diType.declarationFileNames.forEach(fileName => {
      FileGraph.add(component.fileName, fileName);
    });
  });
};
