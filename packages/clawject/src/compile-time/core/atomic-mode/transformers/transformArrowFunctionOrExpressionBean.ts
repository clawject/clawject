import ts, { factory } from 'typescript';
import { ClassPropertyWithArrowFunctionInitializer, ClassPropertyWithExpressionInitializer } from '../../ts/types';
import { Bean } from '../../bean/Bean';
import { isDecoratorFromLibrary } from '../../decorator-processor/isDecoratorFromLibrary';

export const transformArrowFunctionOrExpressionBean = (bean: Bean<ClassPropertyWithArrowFunctionInitializer | ClassPropertyWithExpressionInitializer | ts.GetAccessorDeclaration>): ts.PropertyDeclaration | ts.GetAccessorDeclaration => {
  const filteredModifiers = bean.node.modifiers?.filter(modifier => !isDecoratorFromLibrary(modifier, undefined));

  if (ts.isGetAccessorDeclaration(bean.node)) {
    return factory.updateGetAccessorDeclaration(
      bean.node,
      filteredModifiers,
      bean.node.name,
      bean.node.parameters,
      bean.node.type,
      bean.node.body,
    );
  }

  return factory.updatePropertyDeclaration(
    bean.node,
    filteredModifiers,
    bean.node.name,
    bean.node.questionToken,
    bean.node.type,
    bean.node.initializer,
  );
};
