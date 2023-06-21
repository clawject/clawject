import ts, { factory } from 'typescript';
import { ElementKind, InternalsAccessBuilder } from '../../internals-access/InternalsAccessBuilder';

export const replaceExtendingFromCatContext = (node: ts.ClassDeclaration): ts.ClassDeclaration => {
    const newExtendsHeritageClause = factory.createHeritageClause(
        ts.SyntaxKind.ExtendsKeyword,
        [factory.createExpressionWithTypeArguments(
            InternalsAccessBuilder.internalPropertyAccessExpression(ElementKind.InternalCatContext),
            undefined
        )]
    );
    const implementsHeritageClause = node.heritageClauses?.filter(it => it.token === ts.SyntaxKind.ImplementsKeyword) ?? [];

    return ts.factory.updateClassDeclaration(
        node,
        node.modifiers,
        node.name,
        node.typeParameters,
        [newExtendsHeritageClause, ...implementsHeritageClause],
        node.members
    );
};
