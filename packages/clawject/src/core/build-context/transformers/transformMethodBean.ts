import ts, { factory } from 'typescript';
import { ContextBean } from '../../bean/ContextBean';
import { getDependenciesVariables } from './getDependenciesVariables';
import { isDecoratorFromLibrary } from '../../ts/predicates/isDecoratorFromLibrary';

export const transformMethodBean = (bean: ContextBean<ts.MethodDeclaration>): ts.MethodDeclaration => {
    const nodeBody = bean.node.body ?? factory.createBlock([]);
    const beansVariables = getDependenciesVariables(bean);
    const newBody = factory.updateBlock(
        nodeBody,
        [
            ...beansVariables,
            ...nodeBody.statements,
        ]
    );

    return factory.updateMethodDeclaration(
        bean.node,
        bean.node.modifiers?.filter(modifier => !isDecoratorFromLibrary(modifier, undefined)),
        undefined,
        bean.node.name,
        undefined,
        undefined,
        [],
        bean.node.type,
        newBody,
    );
};
