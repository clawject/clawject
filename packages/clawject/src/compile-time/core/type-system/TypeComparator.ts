import { getCompilationContext } from '../../../transformer/getCompilationContext';
import ts, { ObjectFlags, TypeFlags } from 'typescript';
import { get } from 'lodash';
import { isNotEmpty } from '../utils/isNotEmpty';

class ObjectTypeWrapper {
  constructor(
    public typeSymbol: ts.Symbol | undefined,
    public typeArguments: ts.Type[],
  ) {}

  equals(other: ObjectTypeWrapper): boolean {
    return this.typeSymbol === other.typeSymbol &&
      this.typeArguments.length === other.typeArguments.length &&
      this.typeArguments.every((it, i) => it === other.typeArguments[i]);
  }
}

export class TypeComparator {

  static checkFlag(type: ts.Type, flag: ts.TypeFlags): boolean {
    return !!(type.flags & flag);
  }

  static checkObjectFlag(type: ts.Type, flag: ts.ObjectFlags): boolean {
    return !!(get(type, 'objectFlags', 0) & flag);
  }

  static isReferenceType(type: ts.Type): type is ts.TypeReference {
    return this.checkObjectFlag(type, ObjectFlags.Reference);
  }

  private static getExpandedReferenceTypes(type: ts.TypeReference): ObjectTypeWrapper[] {
    const typeChecker = getCompilationContext().typeChecker;

    const baseType = type as ts.TypeReference;
    const baseTypeArguments = typeChecker.getTypeArguments(baseType).filter(it => {
      return !ts.isThisTypeParameter(it);
    });
    const baseTypeSymbol = baseType.getSymbol();
    const processedElements: ObjectTypeWrapper[] = [];
    const stack: ObjectTypeWrapper[] = [
      new ObjectTypeWrapper(baseTypeSymbol, baseTypeArguments as ts.Type[])
    ];

    while (stack.length > 0) {
      const typeWithTypeArguments = stack.pop()!;
      const {typeSymbol, typeArguments} = typeWithTypeArguments;
      processedElements.push(typeWithTypeArguments);

      if (!typeSymbol) {
        return [];
      }

      typeSymbol.getDeclarations()?.forEach(declaration => {
        if (ts.isClassDeclaration(declaration) || ts.isInterfaceDeclaration(declaration)) {
          const typeArgumentsMap = new Map<ts.Symbol, ts.Type | null>();
          declaration.typeParameters?.forEach((it, i) => {
            typeArgumentsMap.set(it.symbol, typeArguments[i] ?? null);
          });

          const heritageClausesMembers = declaration.heritageClauses?.map(it => it.types).flat() ?? [];

          heritageClausesMembers.forEach(member => {
            const memberSymbol = typeChecker.getTypeAtLocation(member).getSymbol();
            const memberTypeArguments = member.typeArguments?.map(it => {
              const type = typeChecker.getTypeAtLocation(it);
              if (ts.isThisTypeParameter(type)) {
                return;
              }

              const symbol = type.getSymbol();

              if (!symbol) {
                return type;
              }

              let foundType = typeArgumentsMap.get(symbol);

              if (!foundType) {
                for (const declaration of symbol.getDeclarations() ?? []) {
                  foundType = typeArgumentsMap.get(declaration.symbol);

                  if (foundType) {
                    break;
                  }
                }
              }

              return foundType ?? type;
            }).filter(isNotEmpty) ?? [];

            const typeWithTypeArguments = new ObjectTypeWrapper(memberSymbol, memberTypeArguments);

            if (processedElements.some(it => it.equals(typeWithTypeArguments))) {
              return;
            } else {
              stack.push(new ObjectTypeWrapper(memberSymbol, memberTypeArguments));
            }
          });
        }
      });
    }

    return processedElements;
  }

  static compareType(source: ts.Type, target: ts.Type): boolean {
    const typeChecker = getCompilationContext().typeChecker;

    const isAssignableByTypescript = typeChecker.isTypeAssignableTo(source, target);

    if (!isAssignableByTypescript) {
      return false;
    }

    if (this.checkFlag(source, TypeFlags.Any) || this.checkFlag(target, TypeFlags.Any)) {
      return true;
    }

    if (this.checkFlag(source, TypeFlags.Unknown) || this.checkFlag(target, TypeFlags.Unknown)) {
      return true;
    }

    if (this.checkFlag(source, TypeFlags.Union)) {
      return false;
    }

    if (this.checkFlag(source, TypeFlags.Intersection) && this.checkFlag(target, TypeFlags.Intersection)) {
      return (target as ts.IntersectionType).types.every(targetType => {
        return (source as ts.IntersectionType).types.some(sourceType => this.compareType(sourceType, targetType));
      });
    }

    if (this.checkFlag(target, TypeFlags.Union)) {
      return (target as ts.UnionType).types.some(it => this.compareType(source, it));
    }

    if (this.checkFlag(target, TypeFlags.Intersection)) {
      return (target as ts.IntersectionType).types.every(it => this.compareType(source, it));
    }

    if (this.checkFlag(source, TypeFlags.Intersection)) {
      return (source as ts.IntersectionType).types.some(it => this.compareType(it, target));
    }

    if (this.checkFlag(source, TypeFlags.Primitive) !== this.checkFlag(target, TypeFlags.Primitive)) {
      return false;
    }

    if (this.checkObjectFlag(source, ObjectFlags.Anonymous) || this.checkObjectFlag(target, ObjectFlags.Anonymous)) {
      return this.compareAnonymousAliasSymbols(source, target);
    }

    if (typeChecker.isTupleType(source) || typeChecker.isTupleType(target)) {
      return this.compareTupleTypes(source as ts.TupleType, target as ts.TupleType);
    }

    if (this.checkFlag(source, TypeFlags.Object) && this.checkFlag(target, TypeFlags.Object)) {
      if (this.isReferenceType(source) && this.isReferenceType(target)) {
        const expandedSourceTypes = this.getExpandedReferenceTypes(source);
        const expandedTargetTypes = this.getExpandedReferenceTypes(target);

        return this.compareObjectTypeWrappers(expandedSourceTypes, expandedTargetTypes);
      }

      return this.compareObjectTypes(source as ts.ObjectType, target as ts.ObjectType);
    }

    return isAssignableByTypescript;
  }

  private static compareObjectTypes(source: ts.ObjectType, target: ts.ObjectType): boolean {
    const typeChecker = getCompilationContext().typeChecker;

    const targetSymbol = target.getSymbol() ?? target.aliasSymbol ?? target.symbol;
    const sourceSymbol = source.getSymbol() ?? source.aliasSymbol ?? source.symbol;

    const equalByDeclarations = this.compareDeclarationsBySymbol(sourceSymbol, targetSymbol);

    if (!equalByDeclarations) {
      return false;
    }

    if (this.isReferenceType(source) && this.isReferenceType(target)) {
      const targetTypeArguments = typeChecker.getTypeArguments(target);
      const sourceTypeArguments = typeChecker.getTypeArguments(source);

      if (targetTypeArguments.length !== sourceTypeArguments.length) {
        return false;
      }

      return targetTypeArguments.every((targetTypeArgument, index) => {
        return this.compareType(sourceTypeArguments[index], targetTypeArgument);
      });
    }

    return equalByDeclarations;
  }

  private static compareTupleTypes(source: ts.TupleType, target: ts.TupleType): boolean {
    const typeChecker = getCompilationContext().typeChecker;

    if (!typeChecker.isTupleType(source) || !typeChecker.isTupleType(target)) {
      return false;
    }

    const targetTypeArguments = typeChecker.getTypeArguments(target);
    const sourceTypeArguments = typeChecker.getTypeArguments(source);

    if (targetTypeArguments.length !== sourceTypeArguments.length) {
      return false;
    }

    return targetTypeArguments.every((targetTypeArgument, index) => {
      return this.compareType(sourceTypeArguments[index], targetTypeArgument);
    });
  }

  private static compareAnonymousAliasSymbols(source: ts.Type, target: ts.Type): boolean {
    const targetSymbol = target.aliasSymbol;
    const sourceSymbol = source.aliasSymbol;

    if (!sourceSymbol || !targetSymbol) {
      return false;
    }

    const equalByDeclarations = this.compareDeclarationsBySymbol(sourceSymbol, targetSymbol);

    if (!equalByDeclarations) {
      return false;
    }

    const targetTypeArguments = target.aliasTypeArguments ?? [];
    const sourceTypeArguments = source.aliasTypeArguments ?? [];

    if (targetTypeArguments.length !== sourceTypeArguments.length) {
      return false;
    }

    return targetTypeArguments.every((targetTypeArgument, index) => {
      return this.compareType(sourceTypeArguments[index], targetTypeArgument);
    });
  }

  static compareDeclarationsBySymbol(source: ts.Symbol, target: ts.Symbol): boolean {
    const targetDeclarations = target.getDeclarations() ?? [];
    const sourceDeclarations = new Set(source.getDeclarations() ?? []);

    return targetDeclarations.every(it => sourceDeclarations.has(it));
  }

  private static compareObjectTypeWrappers(source: ObjectTypeWrapper[], target: ObjectTypeWrapper[]): boolean {
    return target.every(targetType => {
      return source.some(sourceType => {
        if (!sourceType.typeSymbol || !targetType.typeSymbol) {
          return false;
        }

        const isCompatibleBySymbol = TypeComparator.compareDeclarationsBySymbol(sourceType.typeSymbol, targetType.typeSymbol);

        if (!isCompatibleBySymbol) {
          return false;
        }

        if (sourceType.typeArguments.length !== targetType.typeArguments.length) {
          return false;
        }

        return sourceType.typeArguments.every((it, i) => {
          return TypeComparator.compareType(it, targetType.typeArguments[i]);
        });
      });
    });
  }
}
