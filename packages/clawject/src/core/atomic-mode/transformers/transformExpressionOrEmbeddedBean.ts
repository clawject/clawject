import ts, { factory } from 'typescript';
import { ClassPropertyWithExpressionInitializer } from '../../ts/types';
import { Bean } from '../../bean/Bean';
import { isDecoratorFromLibrary } from '../../ts/predicates/isDecoratorFromLibrary';

export const transformExpressionOrEmbeddedBean = (bean: Bean<ClassPropertyWithExpressionInitializer>): ts.PropertyDeclaration => {
    const newExpression = factory.createArrowFunction(
        undefined,
        undefined,
        [],
        bean.node.type,
        undefined,
        bean.node.initializer,
    );

    return factory.updatePropertyDeclaration(
        bean.node,
        bean.node.modifiers?.filter(modifier => !isDecoratorFromLibrary(modifier, undefined)),
        bean.node.name,
        bean.node.questionToken,
        bean.node.type,
        newExpression,
    );
};
