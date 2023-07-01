import ts, { factory } from 'typescript';
import { AutowiredElement } from '../../../autowired/AutowiredElement';
import { isDecoratorFromLibrary } from '../../../ts/predicates/isDecoratorFromLibrary';
import { InternalsAccessBuilder } from '../../../internals-access/InternalsAccessBuilder';

export const transformAutowiredMember = (autowired: AutowiredElement, node: ts.ClassElement): ts.ClassElement => {
    const castedNode = node as ts.PropertyDeclaration;
    const newInitializer = InternalsAccessBuilder.internalGetInstanceCallExpression(autowired.runtimeId);

    return factory.updatePropertyDeclaration(
        castedNode,
        castedNode.modifiers?.filter(modifier => !isDecoratorFromLibrary(modifier, undefined)),
        castedNode.name,
        castedNode.questionToken,
        castedNode.type,
        newInitializer,
    );
};
