import ts, { factory } from 'typescript';
import upath from 'upath';
import { CONSTANTS } from '../../../constants';

export enum InternalElementKind {
  InternalApplicationFactory = 'InternalApplicationFactory',
  ContextManager = 'ContextManager',
}

export class InternalsAccessBuilder {
  private static TOKEN = 'CLAWJECT_INTERNAL_TOKEN_ಠ_ಠ';

  static importDeclarationToInternal(): ts.ImportDeclaration {
    const importSpecifierPath = upath.join(
      CONSTANTS.libraryName,
      'runtime/___INTERNAL___',
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


  static identifier(elementKind: InternalElementKind): ts.Identifier {
    return ts.factory.createIdentifier(elementKind);
  }


  static internalPropertyAccessExpression(elementKind: InternalElementKind): ts.PropertyAccessExpression {
    return factory.createPropertyAccessExpression(
      factory.createIdentifier(this.TOKEN),
      factory.createIdentifier(elementKind)
    );
  }

  static internalGetInstanceCallExpression(runtimeId: string): ts.CallExpression {
    return factory.createCallExpression(
      factory.createPropertyAccessExpression(
        InternalsAccessBuilder.internalPropertyAccessExpression(InternalElementKind.InternalApplicationFactory),
        factory.createIdentifier('getInstanceFor')
      ),
      undefined,
      [factory.createStringLiteral(runtimeId)],
    );
  }
}
