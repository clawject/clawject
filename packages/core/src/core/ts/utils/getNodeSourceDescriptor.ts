import type ts from 'typescript';
import { isNamedDeclaration } from '../predicates/isNamedDeclaration';
import upath from 'upath';
import { Context } from '../../../compilation-context/Context';
import { CONSTANTS } from '../../../constants/index';

export interface INodeSource {
  fileName: string;
  originalName: string | null;
  isLibraryNode: boolean;
  originalNode: ts.Node;
}

export const getNodeSourceDescriptor = (node: ts.Node): INodeSource[] | null => {
  const symbol = Context.typeChecker.getSymbolAtLocation(node);

  if (!symbol) {
    return null;
  }

  try {
    const originalSymbol = symbol.valueDeclaration ? symbol : Context.typeChecker.getAliasedSymbol(symbol);
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
