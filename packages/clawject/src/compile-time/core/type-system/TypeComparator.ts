import { getCompilationContext } from '../../../transformer/getCompilationContext';
import ts, { ObjectFlags, TypeFlags } from 'typescript';
import { get } from 'lodash';

export class TypeComparator {

  static checkFlag(type: ts.Type, flag: ts.TypeFlags): boolean {
    return !!(type.flags & flag);
  }

  static checkObjectFlag(type: ts.Type, flag: ts.ObjectFlags): boolean {
    return !!(get(type, 'objectFlags', 0) & flag);
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

    if (this.checkObjectFlag(source, ObjectFlags.Anonymous) || this.checkObjectFlag(target, ObjectFlags.Anonymous)) {
      return this.compareAnonymousAliasSymbols(source, target);
    }

    if (typeChecker.isTupleType(source) || typeChecker.isTupleType(target)) {
      return this.compareTupleTypes(source as ts.TupleType, target as ts.TupleType);
    }

    if (this.checkFlag(target, TypeFlags.Object) && this.checkFlag(source, TypeFlags.Object)) {
      return this.compareObjectTypes(source as ts.ObjectType, target as ts.ObjectType);
    }

    if (this.checkFlag(source, TypeFlags.Union)) {
      return false;
    }

    if (this.checkFlag(target, TypeFlags.Union)) {
      return (target as ts.UnionType).types.some(it => this.compareType(source, it));
    }

    if (this.checkFlag(target, TypeFlags.Intersection)) {
      if (this.checkFlag(source, TypeFlags.Intersection)) {
        return (target as ts.IntersectionType).types.every(it =>
          (source as ts.IntersectionType).types.some(sourceIt => this.compareType(sourceIt, it)));
      }

      return (target as ts.UnionType).types.every(it => this.compareType(source, it));
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

  private static compareDeclarationsBySymbol(source: ts.Symbol, target: ts.Symbol): boolean {
    const targetDeclarations = target.getDeclarations() ?? [];
    const sourceDeclarations = new Set(source.getDeclarations() ?? []);

    return targetDeclarations.every(it => sourceDeclarations.has(it));
  }

  private static isReferenceType(type: ts.Type): type is ts.TypeReference {
    return this.checkObjectFlag(type, ObjectFlags.Reference);
  }
}
