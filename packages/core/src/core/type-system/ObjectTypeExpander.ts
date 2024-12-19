import * as ts from 'typescript';
import { Context } from '../../compilation-context/Context';

export class ExpandedObjectType {
  constructor(public symbol: ts.Symbol | undefined, public typeArguments: Array<ExpandedObjectType[] | ts.Type>) {}

  equals(other: ExpandedObjectType): boolean {
    if (this.symbol !== other.symbol) {
      return false;
    }

    if (this.typeArguments.length !== other.typeArguments.length) {
      return false;
    }

    return this.typeArguments.every((it, i) => {
      const otherTypeArgs = other.typeArguments[i];
      if (it instanceof Array && otherTypeArgs instanceof Array) {
        return it.every((type, j) => type.equals(otherTypeArgs[j]));
      }

      if (it instanceof Array || otherTypeArgs instanceof Array) {
        return false;
      }

      return it === otherTypeArgs;
    });
  }
}

interface ToProcess {
    declaration: ts.Declaration;
    typeArguments: ts.Type[];
}

export class ObjectTypeExpander {
  private static expandedObjectTypeCache = new WeakMap<
    ts.ObjectType,
    ExpandedObjectType[]
  >();

  static get(type: ts.ObjectType): ExpandedObjectType[] {
    let cached = this.expandedObjectTypeCache.get(type);
    if (!cached) {
      cached = this._get(type);
      this.expandedObjectTypeCache.set(type, cached);
    }

    return cached;
  }

  private static _get(
    type: ts.ObjectType,
    passedTypeArguments: ts.Type[] | null = null,
    lookupTable: Map<ts.Symbol, ts.Type> = new Map(),
    stack: ExpandedObjectType[] = []
  ): ExpandedObjectType[] {
    const rootTypeArguments =
      passedTypeArguments ?? this.getTypeArguments(type);
    const result: ExpandedObjectType[] = [];
    const rootTypeDeclarations = type.getSymbol()?.getDeclarations() ?? [];
    const typeDeclarationsToProcess = rootTypeDeclarations.map((declaration) =>
      this.getToProcess(declaration, rootTypeArguments)
    );
    const typeParametersLookupTable = new Map<ts.Symbol, ts.Type>(lookupTable);

    while (typeDeclarationsToProcess.length > 0) {
      const { declaration, typeArguments } = typeDeclarationsToProcess.pop()!;

      if (
        !Context.ts.isClassDeclaration(declaration) &&
        !Context.ts.isInterfaceDeclaration(declaration)
      ) {
        continue;
      }

      this.fillLookupTable(declaration, typeArguments, typeParametersLookupTable);
      const expandedTypeArguments = this.getExpandedTypeArguments(
        declaration,
        typeArguments,
        typeParametersLookupTable,
        stack,
      );

      const resultObjectType = new ExpandedObjectType(declaration.symbol, expandedTypeArguments);
      const existing = stack.find((it) => it.equals(resultObjectType));
      result.push(resultObjectType);
      if (existing) {
        continue;
      } else {
        stack.push(resultObjectType);
      }

      this.processHeritageClauses(declaration, typeParametersLookupTable, typeDeclarationsToProcess);
    }

    return result;
  }

  private static getToProcess(
    declaration: ts.Declaration,
    typeArguments: ts.Type[]
  ): ToProcess {
    return { declaration, typeArguments };
  }

  private static getTypeArguments(type: ts.ObjectType): ts.Type[] {
    if (this.isTypeReference(type)) {
      return Array.from(Context.typeChecker.getTypeArguments(type)).filter(
        (it) => {
          return !Context.ts.isThisTypeParameter(it);
        }
      );
    }
    return [];
  }

  private static isTypeReference(
    type: ts.ObjectType
  ): type is ts.TypeReference {
    return Boolean(type.objectFlags & Context.ts.ObjectFlags.Reference);
  }

  private static isObjectType(type: ts.Type): type is ts.ObjectType {
    return Boolean(type.flags & Context.ts.TypeFlags.Object);
  }

  private static fillLookupTable(
    declaration: ts.ClassDeclaration | ts.InterfaceDeclaration,
    declarationTypeArguments: ts.Type[],
    typeParametersLookupTable: Map<ts.Symbol, ts.Type>,
  ): void {
    //TODO check when thisTypeParameter appears
    declaration.typeParameters?.forEach((it, i) => {
      const symbols = [it.symbol];
      it.symbol.getDeclarations()?.forEach((it) => {
        if (Context.ts.isTypeParameterDeclaration(it)) {
          symbols.push(it.symbol);
        }
      });

      symbols.forEach((it) => {
        if (!typeParametersLookupTable.has(it)) {
          const type = declarationTypeArguments[i];
          const typeSymbol = type.getSymbol() ?? type.symbol;
          const typeToSet = typeSymbol ? typeParametersLookupTable.get(typeSymbol) ?? type : type;
          typeParametersLookupTable.set(it, typeToSet);
        }
      });
    });
  }

  private static getExpandedTypeArguments(
    declaration: ts.ClassDeclaration | ts.InterfaceDeclaration,
    declarationTypeArguments: ts.Type[],
    typeParametersLookupTable: Map<ts.Symbol, ts.Type>,
    stack: ExpandedObjectType[]
  ): (ExpandedObjectType[] | ts.Type)[] {
    const resolvedTypeArguments =
      declaration.typeParameters?.map((typeParameter, index) => {
        const lookupType = typeParametersLookupTable.get(
          typeParameter.symbol
        );

        return (
          declarationTypeArguments[index] ??
          lookupType ??
          Context.typeChecker.getTypeAtLocation(typeParameter)
        );
      }) ?? [];

    return resolvedTypeArguments.map((declarationTypeArgument) => {
      if (this.isObjectType(declarationTypeArgument)) {
        let args: ts.Type[] | null = null;

        if (this.isTypeReference(declarationTypeArgument)) {
          args =
            declarationTypeArgument.typeArguments?.map((it) => {
              const typeSymbol = it.getSymbol();

              if (!typeSymbol) {
                return it;
              }

              return typeParametersLookupTable.get(typeSymbol) ?? it;
            }) ?? [];
        }

        return this._get(declarationTypeArgument, args, typeParametersLookupTable, stack);
      }

      return declarationTypeArgument;
    });
  }

  private static processHeritageClauses(
    declaration: ts.ClassDeclaration | ts.InterfaceDeclaration,
    typeParametersLookupTable: Map<ts.Symbol, ts.Type>,
    typeDeclarationsToProcess: ToProcess[]
  ) {
    (declaration.heritageClauses?.map((it) => it.types).flat() ?? []).forEach(
      (member) => {
        const memberSymbol = Context.typeChecker
          .getTypeAtLocation(member)
          .getSymbol();
        if (!memberSymbol) {
          return;
        }

        const memberTypeArguments = Array.from(
          member.typeArguments ?? []
        ).map((it) => {
          const type = Context.typeChecker.getTypeAtLocation(it);
          const typeSymbol = type.getSymbol();

          if (!typeSymbol) {
            return type;
          }

          return typeParametersLookupTable.get(typeSymbol) ?? type;
        });

        (memberSymbol.getDeclarations() ?? []).forEach((it) => {
          typeDeclarationsToProcess.push(
            this.getToProcess(it, memberTypeArguments)
          );
        });
      }
    );
  }
}
