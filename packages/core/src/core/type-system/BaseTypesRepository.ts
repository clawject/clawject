import type ts from 'typescript';
import { CType } from './CType';
import { Context } from '../../compilation-context/Context';
import { CONSTANTS } from '../../constants';

type BaseTypes = {
  CArray: CType;
  CSet: CType;
  CMap: CType;
  CMapStringToAny: CType;
  CPromise: CType;

  CBeanConstructorFactory: CType;
  CClawjectDecorator: CType;

  CApplicationDefinition: CType;
  CConfigurationDefinition: CType;
  CBeanDefinition: CType;
  CLifecycleDefinition: CType;
  CImportDefinition: CType;
  CExposeDefinition: CType;

  CApplicationRef: CType;
  CConfigurationRef: CType;
  CLazy: CType;
  CLazyConfigurationLoader: CType;
};

export class BaseTypesRepository {
  private static baseTypes = new WeakMap<ts.SourceFile, BaseTypes>();
  private static init(sourceFile: ts.SourceFile): BaseTypes {
    const typeTableDeclaration = sourceFile.statements.find(
      (it): it is ts.InterfaceDeclaration =>
        Context.ts.isInterfaceDeclaration(it) &&
        it.name.getText() === '___TypeReferenceTable___'
    );

    if (!typeTableDeclaration) {
      throw new Error(
        `${CONSTANTS.libraryName} type table declaration not found`
      );
    }

    const baseTypes = typeTableDeclaration.members.reduce((acc, curr) => {
      acc[`C${curr.name?.getText() ?? ''}`] = new CType(
        Context.typeChecker.getTypeAtLocation(curr)
      );

      return acc;
    }, {} as BaseTypes);

    this.baseTypes.set(sourceFile, baseTypes);

    return baseTypes;
  }

  static getBaseTypes(): BaseTypes {
    const libraryDeclarationFile = Context.program.getSourceFile(
      CONSTANTS.typeReferenceTablePath
    );
    if (!libraryDeclarationFile) {
      throw new Error(
        `${CONSTANTS.libraryName} library declaration file (${CONSTANTS.typeReferenceTablePath}) not found`
      );
    }

    const baseTypes = this.baseTypes.get(libraryDeclarationFile);
    if (!baseTypes) {
      return this.init(libraryDeclarationFile);
    }

    return baseTypes;
  }
}
