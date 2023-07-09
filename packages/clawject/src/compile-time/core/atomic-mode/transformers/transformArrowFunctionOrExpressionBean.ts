import ts, { factory } from 'typescript';
import { ClassPropertyWithArrowFunctionInitializer, ClassPropertyWithExpressionInitializer } from '../../ts/types';
import { Bean } from '../../bean/Bean';
import { isDecoratorFromLibrary } from '../../decorator-processor/isDecoratorFromLibrary';

export const transformArrowFunctionOrExpressionBean = (bean: Bean<ClassPropertyWithArrowFunctionInitializer | ClassPropertyWithExpressionInitializer>): ts.PropertyDeclaration => {
  return factory.updatePropertyDeclaration(
    bean.node,
    bean.node.modifiers?.filter(modifier => !isDecoratorFromLibrary(modifier, undefined)),
    bean.node.name,
    bean.node.questionToken,
    bean.node.type,
    bean.node.initializer,
  );
};
