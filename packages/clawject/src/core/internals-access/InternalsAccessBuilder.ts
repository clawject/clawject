import ts, { factory } from 'typescript';
import upath from 'upath';
import { CONSTANTS } from '../../constants';

export enum ElementKind {
    InternalCatContext = 'InternalCatContext',
    InternalApplicationFactory = 'InternalApplicationFactory',
}

export class InternalsAccessBuilder {
    private static TOKEN = 'CLAWJECT_INTERNAL_TOKEN_ಠ_ಠ';

    static importDeclarationToInternal(): ts.ImportDeclaration {
        const importSpecifierPath = upath.join(
            CONSTANTS.libraryName,
            'external/___INTERNAL___',
        );

        return factory.createImportDeclaration(
            undefined,
            factory.createImportClause(
                false,
                undefined,
                factory.createNamespaceImport(factory.createIdentifier(this.TOKEN))
            ),
            factory.createStringLiteral(importSpecifierPath),
            undefined
        );
    }


    static identifier(elementKind: ElementKind): ts.Identifier {
        return ts.factory.createIdentifier(elementKind);
    }


    static internalPropertyAccessExpression(elementKind: ElementKind): ts.PropertyAccessExpression {
        return factory.createPropertyAccessExpression(
            factory.createIdentifier(this.TOKEN),
            factory.createIdentifier(elementKind)
        );
    }
}
