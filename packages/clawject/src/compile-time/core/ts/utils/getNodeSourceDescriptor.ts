import ts from 'typescript';
import { CONSTANTS } from '../../../../constants';
import { isNamedDeclaration } from '../predicates/isNamedDeclaration';
import { getCompilationContext } from '../../../../transformer/getCompilationContext';
import upath from 'upath';

export interface INodeSource {
  fileName: string;
  originalName: string | null;
  isLibraryNode: boolean;
  originalNode: ts.Node;
}

export const getNodeSourceDescriptor = (node: ts.Node): INodeSource[] | null => {
  const compilationContext = getCompilationContext();
  const typeChecker = compilationContext.typeChecker;
  const symbol = typeChecker.getSymbolAtLocation(node);

  if (!symbol) {
    return null;
  }

  try {
    const originalSymbol = symbol.valueDeclaration ? symbol : typeChecker.getAliasedSymbol(symbol);
    const declarations = originalSymbol.getDeclarations() ?? [];

    if (declarations.length === 0) {
      return null;
    }

    return declarations.map(declaration => {
      if (!isNamedDeclaration(declaration)) {
        return {
          fileName: declaration.getSourceFile().fileName,
          isLibraryNode: false,
          originalNode: declaration,
          originalName: null,
        };
      }

      const isLibraryNode = upath.normalize(declaration.getSourceFile().fileName).startsWith(CONSTANTS.packageRootDir);

      return {
        fileName: declaration.getSourceFile().fileName,
        isLibraryNode: isLibraryNode,
        originalNode: declaration,
        originalName: declaration.name?.getText() ?? null,
      };
    });
  } catch (error) {
    return null;
  }
};
