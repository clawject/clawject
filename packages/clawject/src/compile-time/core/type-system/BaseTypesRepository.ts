import ts from 'typescript';
import { DIType } from './DIType';
import { CONSTANTS } from '../../../constants';
import { DITypeBuilder } from './DITypeBuilder';
import { ___TypeReferenceTable___ } from '../../../runtime/___TypeReferenceTable___';
import { getCompilationContext } from '../../../transformer/getCompilationContext';

type BaseTypes = Record<keyof ___TypeReferenceTable___, DIType> & { runClawjectApplication: DIType };

export class BaseTypesRepository {
  private static baseTypes: BaseTypes | null = null;

  static clear(): void {
    this.baseTypes = null;
  }

  static init(): void {
    const compilationContext = getCompilationContext();

    if (this.baseTypes !== null) {
      return;
    }

    const libraryDeclarationFile = compilationContext.program.getSourceFile(CONSTANTS.packageRoot);

    if (!libraryDeclarationFile) {
      throw new Error(`${CONSTANTS.libraryName} library declaration file (index.d.ts) not found`);
    }

    const typeTableDeclaration = libraryDeclarationFile.statements
      .find((it): it is ts.InterfaceDeclaration => ts.isInterfaceDeclaration(it) && it.name.getText() === '___TypeReferenceTable___');

    if (!typeTableDeclaration) {
      throw new Error(`${CONSTANTS.libraryName} type table declaration not found`);
    }

    const typesMap = typeTableDeclaration.members
      .reduce((acc, curr) => {
        acc[curr.name?.getText() ?? ''] = curr;

        return acc;
      }, {} as Record<string, ts.TypeElement>);

    this.baseTypes = {
      array: DITypeBuilder.build(compilationContext.typeChecker.getTypeAtLocation(typesMap['array'])),
      set: DITypeBuilder.build(compilationContext.typeChecker.getTypeAtLocation(typesMap['set'])),
      map: DITypeBuilder.build(compilationContext.typeChecker.getTypeAtLocation(typesMap['map'])),
      mapStringToAny: DITypeBuilder.build(compilationContext.typeChecker.getTypeAtLocation(typesMap['mapStringToAny'])),
      CatContext: DITypeBuilder.build(compilationContext.typeChecker.getTypeAtLocation(typesMap['CatContext'])),
      runClawjectApplication: DITypeBuilder.empty(),
      // runClawjectApplication: DITypeBuilder.build(compilationContext.typeChecker.getTypeAtLocation(typesMap['runClawjectApplication'])),
    };
  }

  static getBaseTypes(): BaseTypes {
    if (this.baseTypes === null) {
      throw new Error('Base types are not initialized');
    }

    return this.baseTypes;
  }
}
