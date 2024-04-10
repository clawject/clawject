import type * as ts from 'typescript';
import upath from 'upath';
import { Context } from '../../compilation-context/Context';
import { CONSTANTS } from '../../constants/index';

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

    return Context.factory.createImportDeclaration(
      undefined,
      Context.factory.createImportClause(
        false,
        undefined,
        Context.factory.createNamespaceImport(this.currentIdentifier)
      ),
      Context.factory.createStringLiteral(importSpecifierPath),
      undefined
    );
  }

  static internalPropertyAccessExpression(elementKind: InternalElementKind): ts.PropertyAccessExpression {
    return Context.factory.createPropertyAccessExpression(
      this.currentIdentifier,
      Context.factory.createIdentifier(elementKind)
    );
  }
}
