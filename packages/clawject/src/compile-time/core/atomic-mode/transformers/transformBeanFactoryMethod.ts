import ts, { factory } from 'typescript';
import { Bean } from '../../bean/Bean';
import { isDecoratorFromLibrary } from '../../decorator-processor/isDecoratorFromLibrary';

export const transformBeanFactoryMethod = (bean: Bean<ts.MethodDeclaration>): ts.MethodDeclaration => {
  return factory.updateMethodDeclaration(
    bean.node,
    bean.node.modifiers?.filter(modifier => !isDecoratorFromLibrary(modifier, undefined)),
    undefined,
    bean.node.name,
    undefined,
    undefined,
    bean.node.parameters,
    bean.node.type,
    bean.node.body,
  );
};
