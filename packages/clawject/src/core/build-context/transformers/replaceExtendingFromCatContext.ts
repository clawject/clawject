import ts, { factory } from 'typescript';
import { getDecoratorsOnly } from '../../ts/utils/getDecoratorsOnly';
import { PRIVATE_TOKEN } from '../constants';

export const INTERNAL_CAT_CONTEXT_IMPORT = `INTERNAL_CAT_CONTEXT_IMPORT${PRIVATE_TOKEN}`;

export const replaceExtendingFromCatContext = (node: ts.ClassDeclaration): ts.ClassDeclaration => {
    const newHeritageClause = factory.createHeritageClause(
        ts.SyntaxKind.ExtendsKeyword,
        [factory.createExpressionWithTypeArguments(
            factory.createPropertyAccessExpression(
                factory.createIdentifier(INTERNAL_CAT_CONTEXT_IMPORT),
                factory.createIdentifier('InternalCatContext')
            ),
            undefined
        )]
    );

    return ts.factory.updateClassDeclaration(
        node,
        [...getDecoratorsOnly(node), ...node.modifiers ?? []],
        node.name,
        node.typeParameters,
        [newHeritageClause],
        node.members
    );
};
