import ts, { factory } from 'typescript';
import upath from 'upath';
import { CONSTANTS } from '../../../constants';

export enum InternalElementKind {
  ApplicationManager = 'ApplicationManager',
  ClawjectInternalRuntimeUtils = '___ClawjectInternalRuntimeUtils___',
}

export class InternalsAccessBuilder {
  private static _currentIdentifier: ts.Identifier | undefined;

  static get currentIdentifier(): ts.Identifier {
    if (!this._currentIdentifier) {
      throw new Error('Current identifier is not set in InternalsAccessBuilder');
    }

    return this._currentIdentifier;
  }

  static setCurrentIdentifier(identifier: ts.Identifier): void {
    this._currentIdentifier = identifier;
  }

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
        factory.createNamespaceImport(this.currentIdentifier)
      ),
      factory.createStringLiteral(importSpecifierPath),
      undefined
    );
  }

  static internalPropertyAccessExpression(elementKind: InternalElementKind): ts.PropertyAccessExpression {
    return factory.createPropertyAccessExpression(
      this.currentIdentifier,
      factory.createIdentifier(elementKind)
    );
  }
}
