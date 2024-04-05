import type * as ts from 'typescript';
import { get } from 'lodash';
import { isNotEmpty } from '../utils/isNotEmpty';
import { ConfigLoader } from '../../config/ConfigLoader';
import { Context } from '../../compilation-context/Context';

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
  private static comparatorCache = new WeakMap<ts.Type, WeakMap<ts.Type, boolean>>();
  private static expandedObjectTypeCache = new WeakMap<ts.ObjectType, ObjectTypeWrapper[]>();

  static checkFlag(type: ts.Type, flag: ts.TypeFlags): boolean {
    return !!(type.flags & flag);
  }

  static checkObjectFlag(type: ts.Type, flag: ts.ObjectFlags): boolean {
    return !!(get(type, 'objectFlags', 0) & flag);
  }

  static isReferenceType(type: ts.Type): type is ts.TypeReference {
    return this.checkObjectFlag(type, Context.ts.ObjectFlags.Reference);
  }

  static compareType(source: ts.Type, target: ts.Type): boolean {
    const cached = this.comparatorCache.get(source)?.get(target);

    if (cached !== undefined) {
      return cached;
    }

    const result = this._compareType(source, target);

    if (!this.comparatorCache.has(source)) {
      this.comparatorCache.set(source, new WeakMap());
    }

    this.comparatorCache.get(source)?.set(target, result);

    return result;
  }

  private static _compareType(source: ts.Type, target: ts.Type): boolean {
    const isAssignableByTypescript = Context.typeChecker.isTypeAssignableTo(source, target);

    if (ConfigLoader.get().typeSystem === 'structural') {
      return isAssignableByTypescript;
    }

    if (!isAssignableByTypescript) {
      return false;
    }

    if (this.checkFlag(source, Context.ts.TypeFlags.Any) || this.checkFlag(target, Context.ts.TypeFlags.Any)) {
      return true;
    }

    if (this.checkFlag(source, Context.ts.TypeFlags.Unknown) || this.checkFlag(target, Context.ts.TypeFlags.Unknown)) {
      return true;
    }

    if (this.checkFlag(source, Context.ts.TypeFlags.Union)) {
      return (source as ts.UnionType).types.every(it => this.compareType(it, target));
    }

    if (this.checkFlag(source, Context.ts.TypeFlags.Intersection) && this.checkFlag(target, Context.ts.TypeFlags.Intersection)) {
      return (target as ts.IntersectionType).types.every(targetType => {
        return (source as ts.IntersectionType).types.some(sourceType => this.compareType(sourceType, targetType));
      });
    }

    if (this.checkFlag(target, Context.ts.TypeFlags.Union)) {
      return (target as ts.UnionType).types.some(it => this.compareType(source, it));
    }

    if (this.checkFlag(target, Context.ts.TypeFlags.Intersection)) {
      return (target as ts.IntersectionType).types.every(it => this.compareType(source, it));
    }

    if (this.checkFlag(source, Context.ts.TypeFlags.Intersection)) {
      return (source as ts.IntersectionType).types.some(it => this.compareType(it, target));
    }

    if (this.checkFlag(source, Context.ts.TypeFlags.Primitive) !== this.checkFlag(target, Context.ts.TypeFlags.Primitive)) {
      return false;
    }

    if (this.checkObjectFlag(source, Context.ts.ObjectFlags.Anonymous) || this.checkObjectFlag(target, Context.ts.ObjectFlags.Anonymous)) {
      return this.compareAnonymousAliasSymbols(source, target);
    }

    if (Context.typeChecker.isTupleType(source) || Context.typeChecker.isTupleType(target)) {
      return this.compareTupleTypes(source as ts.TupleType, target as ts.TupleType);
    }

    if (this.checkFlag(source, Context.ts.TypeFlags.Object) && this.checkFlag(target, Context.ts.TypeFlags.Object)) {
      const expandedSourceTypes = this.getExpandedObjectType(source as ts.ObjectType);
      const expandedTargetTypes = this.getExpandedObjectType(target as ts.ObjectType);

      return this.compareObjectTypeWrappers(expandedSourceTypes, expandedTargetTypes);
    }

    return isAssignableByTypescript;
  }

  static getExpandedObjectType(type: ts.ObjectType): ObjectTypeWrapper[] {
    const cached = this.expandedObjectTypeCache.get(type);

    if (cached) {
      return cached;
    }

    const baseType = type as ts.TypeReference;
    const baseTypeArguments = Context.typeChecker.getTypeArguments(baseType).filter(it => {
      return !Context.ts.isThisTypeParameter(it);
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
        if (Context.ts.isClassDeclaration(declaration) || Context.ts.isInterfaceDeclaration(declaration)) {
          const typeArgumentsMap = new Map<ts.Symbol, ts.Type | null>();
          declaration.typeParameters?.forEach((it, i) => {
            typeArgumentsMap.set(it.symbol, typeArguments[i] ?? null);
          });

          const heritageClausesMembers = declaration.heritageClauses?.map(it => it.types).flat() ?? [];

          heritageClausesMembers.forEach(member => {
            const memberSymbol = Context.typeChecker.getTypeAtLocation(member).getSymbol();
            const memberTypeArguments = member.typeArguments?.map(it => {
              const type = Context.typeChecker.getTypeAtLocation(it);
              if (Context.ts.isThisTypeParameter(type)) {
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

    this.expandedObjectTypeCache.set(type, processedElements);
    return processedElements;
  }

  private static compareTupleTypes(source: ts.TupleType, target: ts.TupleType): boolean {
    if (!Context.typeChecker.isTupleType(source) || !Context.typeChecker.isTupleType(target)) {
      return false;
    }

    const targetTypeArguments = Context.typeChecker.getTypeArguments(target);
    const sourceTypeArguments = Context.typeChecker.getTypeArguments(source);

    if (targetTypeArguments.length !== sourceTypeArguments.length) {
      return false;
    }

    return targetTypeArguments.every((targetTypeArgument, index) => {
      return this.compareType(sourceTypeArguments[index], targetTypeArgument);
    });
  }

  private static compareAnonymousAliasSymbols(source: ts.Type, target: ts.Type): boolean {
    const targetSymbol = target.aliasSymbol ?? target.getSymbol() ?? target.symbol;
    const sourceSymbol = source.aliasSymbol ?? source.getSymbol() ?? source.symbol;

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
