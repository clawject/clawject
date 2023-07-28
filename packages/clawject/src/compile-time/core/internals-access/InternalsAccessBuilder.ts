import ts, { factory } from 'typescript';
import upath from 'upath';
import { CONSTANTS } from '../../../constants';

export enum InternalElementKind {
  ApplicationManager = 'ApplicationManager',
  ContextManager = 'ContextManager',
  Utils = 'Utils',
}

export class InternalsAccessBuilder {
  private static TOKEN = 'CLAWJECT_INTERNAL_TOKEN_ಠ_ಠ';

  static importDeclarationToInternal(): ts.ImportDeclaration {
    const importSpecifierPath = upath.join(
      CONSTANTS.libraryName,
      'runtime/___internal___',
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


  //TODO remove
  static internalGetInstanceCallExpression(runtimeId: string): ts.CallExpression {
    return factory.createCallExpression(
      factory.createPropertyAccessExpression(
        InternalsAccessBuilder.internalPropertyAccessExpression(InternalElementKind.ApplicationManager),
        factory.createIdentifier('getInstanceFor')
      ),
      undefined,
      [factory.createStringLiteral(runtimeId)],
    );
  }
}
