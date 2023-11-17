import ts, { factory } from 'typescript';
import { Autowired } from '../../../autowired/Autowired';
import { isDecoratorFromLibrary } from '../../../decorator-processor/isDecoratorFromLibrary';

export const transformAutowiredMember = (autowired: Autowired, node: ts.ClassElement): ts.ClassElement => {
  const castedNode = node as ts.PropertyDeclaration;
  // const newInitializer = InternalsAccessBuilder.internalGetInstanceCallExpression(autowired.runtimeId);

  return factory.updatePropertyDeclaration(
    castedNode,
    castedNode.modifiers?.filter(modifier => !isDecoratorFromLibrary(modifier, undefined)),
    castedNode.name,
    castedNode.questionToken,
    castedNode.type,
    castedNode.initializer,
  );
};
