import ts from 'typescript';
import { ComponentRepository } from './ComponentRepository';
import { registerAutowired } from '../autowired/registerAutowired';
import { registerComponentConstructorDependencies } from './registerComponentConstructorDependencies';

export const processComponent = (node: ts.ClassDeclaration): ts.ClassDeclaration => {
  const component = ComponentRepository.register(node, true);

  registerAutowired(component);
  registerComponentConstructorDependencies(component);

  throw 'TODO';
};
