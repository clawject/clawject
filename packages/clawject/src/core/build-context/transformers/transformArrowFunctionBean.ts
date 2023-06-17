import ts, { factory } from 'typescript';
import { ClassPropertyWithArrowFunctionInitializer } from '../../ts/types';
import { ContextBean } from '../../bean/ContextBean';
import { unwrapExpressionFromRoundBrackets } from '../../ts/utils/unwrapExpressionFromRoundBrackets';
import { getDependenciesVariables } from './getDependenciesVariables';
import { isDecoratorFromLibrary } from '../../ts/predicates/isDecoratorFromLibrary';

export const transformArrowFunctionBean = (bean: ContextBean<ClassPropertyWithArrowFunctionInitializer>): ts.PropertyDeclaration => {
    const newArrowFunction = getTransformedArrowFunction(bean);

    return factory.updatePropertyDeclaration(
        bean.node,
        bean.node.modifiers?.filter(modifier => !isDecoratorFromLibrary(modifier, undefined)),
        bean.node.name,
        bean.node.questionToken,
        bean.node.type,
        newArrowFunction,
    );
};

function getTransformedArrowFunction(bean: ContextBean<ClassPropertyWithArrowFunctionInitializer>): ts.ArrowFunction {
    const arrowFunction = unwrapExpressionFromRoundBrackets(bean.node.initializer);
    const beansVariables = getDependenciesVariables(bean);

    let newBody: ts.Block;

    if (ts.isBlock(arrowFunction.body)) {
        newBody = factory.createBlock(
            [
                ...beansVariables,
                ...arrowFunction.body.statements,
            ],
            true,
        );
    } else {
        newBody = factory.createBlock(
            [
                ...beansVariables,
                factory.createReturnStatement(arrowFunction.body),
            ],
            true,
        );
    }

    return factory.updateArrowFunction(
        arrowFunction,
        arrowFunction.modifiers,
        arrowFunction.typeParameters,
        [],
        arrowFunction.type,
        arrowFunction.equalsGreaterThanToken,
        newBody,
    );
}
