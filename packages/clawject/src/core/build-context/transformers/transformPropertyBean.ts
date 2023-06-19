import ts, { factory } from 'typescript';
import { compact } from 'lodash';
import { ClassPropertyWithCallExpressionInitializer } from '../../ts/types';
import { Bean } from '../../bean/Bean';
import { unwrapExpressionFromRoundBrackets } from '../../ts/utils/unwrapExpressionFromRoundBrackets';
import { getDependencyValueExpression } from './getDependencyValueExpression';
import { isDecoratorFromLibrary } from '../../ts/predicates/isDecoratorFromLibrary';

export const transformPropertyBean = (bean: Bean<ClassPropertyWithCallExpressionInitializer>): ts.MethodDeclaration => {
    return factory.createMethodDeclaration(
        bean.node.modifiers?.filter(modifier => !isDecoratorFromLibrary(modifier, undefined)),
        undefined,
        factory.createIdentifier(bean.classMemberName),
        undefined,
        undefined,
        [],
        bean.node.type,
        getBeanBlock(bean),
    );
};

function getBeanBlock(bean: Bean<ClassPropertyWithCallExpressionInitializer>): ts.Block {
    const dependencies = Array.from(bean.constructorDependencies);

    const dependenciesStatements = dependencies.map(getDependencyValueExpression);

    const className = unwrapExpressionFromRoundBrackets(bean.node.initializer).arguments[0];

    return factory.createBlock(
        [
            factory.createReturnStatement(factory.createNewExpression(
                className,
                undefined,
                compact(dependenciesStatements),
            ))
        ],
        true
    );
}
