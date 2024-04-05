import type * as ts from 'typescript';
import { CONSTANTS } from '../../../constants';
import { ___TypeReferenceTable___ } from '../../../runtime/api/___TypeReferenceTable___';
import { CType } from './CType';
import { Context } from '../../compilation-context/Context';

type BaseTypes = {
  CArray: CType;
  CSet: CType;
  CMap: CType;
  CMapStringToAny: CType;
  CImportedConfiguration: CType;
  CBeanConstructorFactory: CType;
  CPromise: CType;
}

export class BaseTypesRepository {
  private static baseTypes: BaseTypes | null = null;

  static clear(): void {
    this.baseTypes = null;
  }

  static init(): void {
    if (this.baseTypes !== null) {
      return;
    }

    const libraryDeclarationFile = Context.program.getSourceFile(CONSTANTS.typeReferenceTablePath);

    if (!libraryDeclarationFile) {
      throw new Error(`${CONSTANTS.libraryName} library declaration file (${CONSTANTS.typeReferenceTablePath}) not found\n${JSON.stringify(Context.program.getSourceFiles().map(it => it.fileName), null, 2)}\n`);
    }

    const typeTableDeclaration = libraryDeclarationFile.statements
      .find((it): it is ts.InterfaceDeclaration => Context.ts.isInterfaceDeclaration(it) && it.name.getText() === '___TypeReferenceTable___');

    if (!typeTableDeclaration) {
      throw new Error(`${CONSTANTS.libraryName} type table declaration not found`);
    }

    const typesMap = typeTableDeclaration.members
      .reduce((acc, curr) => {
        acc[curr.name?.getText() ?? ''] = curr;

        return acc;
      }, {} as Record<keyof ___TypeReferenceTable___, ts.TypeElement>);

    this.baseTypes = {
      CArray: new CType(Context.typeChecker.getTypeAtLocation(typesMap['Array'])),
      CSet: new CType(Context.typeChecker.getTypeAtLocation(typesMap['Set'])),
      CMap: new CType(Context.typeChecker.getTypeAtLocation(typesMap['Map'])),
      CMapStringToAny: new CType(Context.typeChecker.getTypeAtLocation(typesMap['MapStringToAny'])),
      CImportedConfiguration: new CType(Context.typeChecker.getTypeAtLocation(typesMap['ImportedConfiguration'])),
      CBeanConstructorFactory: new CType(Context.typeChecker.getTypeAtLocation(typesMap['BeanConstructorFactory'])),
      CPromise: new CType(Context.typeChecker.getTypeAtLocation(typesMap['Promise'])),
    };
  }

  static getBaseTypes(): BaseTypes {
    if (this.baseTypes === null) {
      this.init();

      if (this.baseTypes === null) {
        throw new Error('Base types are not initialized');
      }
    }

    return this.baseTypes;
  }
}
