import ts from 'typescript';
import { ComponentRepository } from './ComponentRepository';
import { registerAutowired } from '../autowired/registerAutowired';
import { registerComponentConstructorDependencies } from './registerComponentConstructorDependencies';
import { DITypeBuilder } from '../type-system/DITypeBuilder';

export const processComponent = (node: ts.ClassDeclaration): ts.ClassDeclaration => {
  const component = ComponentRepository.register(node, true);

  const diType = DITypeBuilder.buildForClassComponent(component);

  diType;

  registerAutowired(component);
  registerComponentConstructorDependencies(component);

  throw 'TODO';
};
