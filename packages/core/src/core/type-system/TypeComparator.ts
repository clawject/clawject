import type * as ts from 'typescript';
import { get } from 'lodash';
import { ConfigLoader } from '../../config/ConfigLoader';
import { Context } from '../../compilation-context/Context';
import { ExpandedObjectType, ObjectTypeExpander } from './ObjectTypeExpander';

export class TypeComparator {
  private static structuralComparatorCache = new WeakMap<ts.Type, WeakMap<ts.Type, boolean>>();
  private static nominalComparatorCache = new WeakMap<ts.Type, WeakMap<ts.Type, boolean>>();

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
    if (ConfigLoader.get().typeSystem === 'structural') {
      return this.compareTypeStructurally(source, target);
    }

    return this.compareTypeNominally(source, target);
  }

  static compareTypeStructurally(source: ts.Type, target: ts.Type): boolean {
    const cached = this.structuralComparatorCache.get(source)?.get(target);

    if (cached !== undefined) {
      return cached;
    }

    const result = Context.typeChecker.isTypeAssignableTo(source, target);

    if (!this.structuralComparatorCache.has(source)) {
      this.structuralComparatorCache.set(source, new WeakMap());
    }

    this.structuralComparatorCache.get(source)?.set(target, result);

    return result;
  }

  static compareTypeNominally(source: ts.Type, target: ts.Type): boolean {
    const cached = this.nominalComparatorCache.get(source)?.get(target);

    if (cached !== undefined) {
      return cached;
    }

    const isAssignableByTypescript = this.compareTypeStructurally(source, target);
    if (!isAssignableByTypescript) {
      return false;
    }

    const result = this._compareTypeNominally(source, target);

    if (!this.nominalComparatorCache.has(source)) {
      this.nominalComparatorCache.set(source, new WeakMap());
    }

    this.nominalComparatorCache.get(source)?.set(target, result);

    return result;
  }

  private static _compareTypeNominally(source: ts.Type, target: ts.Type): boolean {
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
      return this.compareAnonymousObjectTypes(source, target);
    }

    if (Context.typeChecker.isTupleType(source) || Context.typeChecker.isTupleType(target)) {
      return this.compareTupleTypes(source as ts.TupleType, target as ts.TupleType);
    }

    if (this.checkFlag(source, Context.ts.TypeFlags.Object) && this.checkFlag(target, Context.ts.TypeFlags.Object)) {
      const expandedSourceTypes = ObjectTypeExpander.get(source as ts.ObjectType);
      const expandedTargetTypes = ObjectTypeExpander.get(target as ts.ObjectType);

      return this.compareExpandedObjectTypes(expandedSourceTypes, expandedTargetTypes);
    }

    return true;
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

  private static compareAnonymousObjectTypes(source: ts.Type, target: ts.Type): boolean {
    const sourceSymbol = source.aliasSymbol ?? source.getSymbol() ?? source.symbol;
    const targetSymbol = target.aliasSymbol ?? target.getSymbol() ?? target.symbol;

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

  private static compareExpandedObjectTypes(source: ExpandedObjectType[], target: ExpandedObjectType[]): boolean {
    return target.every(targetType => {
      return source.some(sourceType => {
        return this.compareExpandedObjectType(sourceType, targetType);
      });
    });
  }

  private static compareExpandedObjectType(source: ExpandedObjectType, target: ExpandedObjectType): boolean {
    if (!source.symbol || !target.symbol) {
      return false;
    }
    if (source.symbol !== target.symbol) {
      return false;
    }

    const equalByDeclarations = this.compareDeclarationsBySymbol(source.symbol, target.symbol);
    if (!equalByDeclarations) {
      return false;
    }

    if (source.typeArguments.length !== target.typeArguments.length) {
      return false;
    }

    return target.typeArguments.every((targetTypeArguments, index) => {
      const sourceTypeArguments = source.typeArguments[index];

      if (sourceTypeArguments instanceof Array && targetTypeArguments instanceof Array) {
        return this.compareExpandedObjectTypes(sourceTypeArguments, targetTypeArguments);
      }

      if (targetTypeArguments instanceof Array) {
        const typed = sourceTypeArguments as unknown as ts.Type;
        return this.checkFlag(typed, Context.ts.TypeFlags.Any)
          || this.checkFlag(typed, Context.ts.TypeFlags.Unknown);
      }
      if (sourceTypeArguments instanceof Array) {
        const typed = targetTypeArguments as unknown as ts.Type;
        return this.checkFlag(typed, Context.ts.TypeFlags.Any)
          || this.checkFlag(typed, Context.ts.TypeFlags.Unknown);
      }

      return this.compareType(sourceTypeArguments as ts.Type, targetTypeArguments as ts.Type);
    });
  }
}
