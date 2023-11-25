import ts, { ObjectFlags, TypeFlags } from 'typescript';
import { DIType } from './DIType';
import { parseFlags } from '../ts/flags/parseFlags';
import { DITypeFlag } from './DITypeFlag';
import { DeclarationInfo } from './DeclarationInfo';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { ConfigLoader } from '../../config/ConfigLoader';
import { Bean } from '../bean/Bean';
import { Component } from '../component/Component';
import { compact, get } from 'lodash';

/**
 * notes:
 * If hasNoDefaultLib is true in source file - that means source file is lib file
 *
 * Type diagram https://user-images.githubusercontent.com/442988/78500144-86799400-775d-11ea-8e2b-52feeec6d39f.png
 * */

export class DITypeBuilder {
  private static emptyWeakMap = new WeakMap<any, any>();

  static build(tsType: ts.Type): DIType {
    return this._build(tsType, null, this.emptyWeakMap);
  }

  static buildForClassDependency(tsType: ts.Type, genericSymbolLookupTable: WeakMap<ts.Symbol, DIType>): DIType {
    return this._build(tsType, null, genericSymbolLookupTable);
  }

  static buildForClassComponent(component: Component): DIType {
    const typeChecker = getCompilationContext().typeChecker;
    const classType = typeChecker.getTypeAtLocation(component.node) as ts.InterfaceType;

    const typeParameters = classType.typeParameters ?? [];

    typeParameters.forEach((typeParameter) => {
      const types = compact([
        typeChecker.getDefaultFromTypeParameter(typeParameter),
        typeChecker.getBaseConstraintOfType(typeParameter),
      ]);

      if (types.length === 0) {
        const unknownType = this.unknown();
        component.genericSymbolLookupTable.set(typeParameter.symbol, unknownType);

        return;
      }

      const diTypes = types.map((it) => this.build(it));
      const diType = this.buildSyntheticIntersectionOrPlain(diTypes);

      component.genericSymbolLookupTable.set(typeParameter.symbol, diType);
    });

    const heritageClausesMembers = component.node.heritageClauses
      ?.map(it => it.types).flat() ?? [];

    const implementsClauseTypes = heritageClausesMembers.map(typeChecker.getTypeAtLocation);

    const baseDIType = this._build(classType, typeParameters, component.genericSymbolLookupTable);
    const clauseTypes = implementsClauseTypes.map(it =>
      this._build(it, null, component.genericSymbolLookupTable)
    );

    return this.buildSyntheticIntersectionOrPlain([baseDIType, ...clauseTypes]);
  }

  static buildForClassBean(tsType: ts.Type, bean: Bean): DIType | null {
    if (!this.isReferenceType(tsType)) {
      return null;
    }
    const typeChecker = getCompilationContext().typeChecker;
    const resolvedTypeArguments = Array.from(tsType.resolvedTypeArguments ?? []);
    const targetTypeTypeArguments = Array.from(tsType.target.typeArguments ?? []);
    const actualTypeArguments = targetTypeTypeArguments.map((_, index) =>
      resolvedTypeArguments[index]
    );
    const genericSymbolToType = new Map<ts.Symbol, ts.Type>(
      actualTypeArguments.map((it, index) => {
        bean.genericSymbolLookupTable.set(targetTypeTypeArguments[index].symbol, this._build(it, null, this.emptyWeakMap));

        return [targetTypeTypeArguments[index].symbol, it];
      }),
    );

    const tsTypeSymbol = tsType.aliasSymbol ?? tsType.getSymbol();
    if (tsTypeSymbol === undefined) {
      return null;
    }

    const classDeclarations = tsTypeSymbol.getDeclarations()?.filter(ts.isClassDeclaration) ?? [];

    if (classDeclarations.length !== 1) {
      return null;
    }

    const classDeclaration = classDeclarations[0];
    const heritageClausesMembers = classDeclaration.heritageClauses
      ?.map(it => it.types).flat() ?? [];

    const implementsClauseTypes = heritageClausesMembers.map(typeChecker.getTypeAtLocation);

    const baseDIType = this._build(tsType, actualTypeArguments, this.emptyWeakMap);
    const clauseTypes = implementsClauseTypes.map(it => {
      if (!this.isReferenceType(it)) {
        return this._build(it, null, this.emptyWeakMap);
      }

      const resolvedTypeArguments = Array.from(typeChecker.getTypeArguments(it))
        .map(it => genericSymbolToType.get(it.symbol) ?? it);

      return this._build(it, resolvedTypeArguments, this.emptyWeakMap);
    });

    return this.buildSyntheticIntersectionOrPlain([baseDIType, ...clauseTypes]);
  }

  static buildSyntheticIntersectionOrPlain(diTypes: DIType[]): DIType {
    if (diTypes.length === 1) {
      return diTypes[0];
    }

    const diType = new DIType();
    diType.tsTypeFlags = ts.TypeFlags.Intersection;
    diType.parsedTSTypeFlags = new Set([ts.TypeFlags.Intersection]);
    diType.typeFlag = DITypeFlag.INTERSECTION;
    diType.unionOrIntersectionTypes = diTypes;

    return diType;
  }

  static any(): DIType {
    const diType = new DIType();

    diType.tsTypeFlags = ts.TypeFlags.Any;
    diType.parsedTSTypeFlags = new Set();

    return diType;
  }

  static unknown(): DIType {
    const diType = new DIType();

    diType.tsTypeFlags = ts.TypeFlags.Unknown;
    diType.parsedTSTypeFlags = new Set();

    return diType;
  }

  private static _build(tsType: ts.Type, resolvedTypeArguments: ts.Type[] | null, genericSymbolLookupTable: WeakMap<ts.Symbol, DIType>): DIType {
    const typeSymbol = tsType.aliasSymbol ?? tsType.symbol;

    const resolvedGenericType = genericSymbolLookupTable.get(typeSymbol);

    if (resolvedGenericType) {
      return resolvedGenericType;
    }

    const diType = new DIType();

    this.setTSFlags(diType, tsType);
    this.setTypeFlag(diType, tsType);
    this.trySetConstantValue(diType, tsType);
    this.trySetTypeArguments(diType, tsType, resolvedTypeArguments, genericSymbolLookupTable);
    this.setUnionOrIntersectionElements(diType, tsType, genericSymbolLookupTable);
    this.trySetDeclarationInfo(diType, tsType);

    return diType;
  }

  private static setTSFlags(diType: DIType, tsType: ts.Type): void {
    diType.tsTypeFlags = tsType.getFlags();
    diType.parsedTSTypeFlags = new Set(parseFlags(ts.TypeFlags, tsType.getFlags()));

    const objectFlags = this.getObjectFlags(tsType);

    if (objectFlags !== null) {
      diType.tsObjectFlags = objectFlags;
      diType.parsedTSObjectFlags = new Set(parseFlags(ts.ObjectFlags, objectFlags));
    }
  }

  private static setTypeFlag(diType: DIType, tsType: ts.Type): void {
    switch (true) {
    case diType.parsedTSObjectFlags.has(ObjectFlags.Anonymous):
      diType.typeFlag = DITypeFlag.ANONYMOUS;
      break;

    case diType.parsedTSTypeFlags.has(TypeFlags.Any):
      diType.typeFlag = DITypeFlag.ANY;
      break;
    case diType.parsedTSTypeFlags.has(TypeFlags.Unknown):
      diType.typeFlag = DITypeFlag.UNKNOWN;
      break;
    case diType.parsedTSTypeFlags.has(TypeFlags.Never):
      diType.typeFlag = DITypeFlag.NEVER;
      break;
    case diType.parsedTSTypeFlags.has(TypeFlags.Void):
      diType.typeFlag = DITypeFlag.VOID;
      break;
    case diType.parsedTSTypeFlags.has(TypeFlags.Undefined):
      diType.typeFlag = DITypeFlag.UNDEFINED;
      break;
    case diType.parsedTSTypeFlags.has(TypeFlags.Null):
      diType.typeFlag = DITypeFlag.NULL;
      break;
    case diType.parsedTSTypeFlags.has(TypeFlags.String) && !diType.parsedTSTypeFlags.has(TypeFlags.StringLiteral) && !diType.parsedTSTypeFlags.has(TypeFlags.EnumLike):
      diType.typeFlag = DITypeFlag.STRING;
      break;
    case diType.parsedTSTypeFlags.has(TypeFlags.Number) && !diType.parsedTSTypeFlags.has(TypeFlags.NumberLiteral) && !diType.parsedTSTypeFlags.has(TypeFlags.EnumLike):
      diType.typeFlag = DITypeFlag.NUMBER;
      break;
    case diType.parsedTSTypeFlags.has(TypeFlags.Boolean) && !diType.parsedTSTypeFlags.has(TypeFlags.BooleanLiteral):
      diType.typeFlag = DITypeFlag.BOOLEAN;
      break;
    case diType.parsedTSTypeFlags.has(TypeFlags.EnumLiteral) && diType.parsedTSTypeFlags.has(TypeFlags.Union) && diType.parsedTSTypeFlags.has(TypeFlags.EnumLike):
      diType.typeFlag = DITypeFlag.ENUM;
      break;
    case diType.parsedTSTypeFlags.has(TypeFlags.BigInt) && !diType.parsedTSTypeFlags.has(TypeFlags.BigIntLiteral):
      diType.typeFlag = DITypeFlag.BIGINT;
      break;
    case diType.parsedTSTypeFlags.has(TypeFlags.StringLiteral) && !diType.parsedTSTypeFlags.has(TypeFlags.EnumLike):
      diType.typeFlag = DITypeFlag.STRING_LITERAL;
      break;
    case diType.parsedTSTypeFlags.has(TypeFlags.NumberLiteral) && !diType.parsedTSTypeFlags.has(TypeFlags.EnumLike):
      diType.typeFlag = DITypeFlag.NUMBER_LITERAL;
      break;
    case diType.parsedTSTypeFlags.has(TypeFlags.BooleanLiteral):
      diType.typeFlag = DITypeFlag.BOOLEAN_LITERAL;
      break;
    case diType.parsedTSTypeFlags.has(TypeFlags.EnumLiteral) && diType.parsedTSTypeFlags.has(TypeFlags.StringOrNumberLiteral) && diType.parsedTSTypeFlags.has(TypeFlags.EnumLike):
      diType.typeFlag = DITypeFlag.ENUM_LITERAL;
      break;
    case diType.parsedTSTypeFlags.has(TypeFlags.BigIntLiteral):
      diType.typeFlag = DITypeFlag.BIGINT_LITERAL;
      break;

    case this.isTupleType(tsType):
      diType.typeFlag = DITypeFlag.TUPLE;
      break;

    case diType.parsedTSTypeFlags.has(TypeFlags.Object):
      diType.typeFlag = DITypeFlag.OBJECT;
      break;
    case diType.parsedTSTypeFlags.has(TypeFlags.Union):
      diType.typeFlag = DITypeFlag.UNION;
      break;
    case diType.parsedTSTypeFlags.has(TypeFlags.Intersection):
      diType.typeFlag = DITypeFlag.INTERSECTION;
      break;
    }
  }

  private static trySetConstantValue(diType: DIType, tsType: ts.Type): void {
    switch (diType.typeFlag) {
    case DITypeFlag.STRING_LITERAL:
    case DITypeFlag.NUMBER_LITERAL:
    case DITypeFlag.BIGINT_LITERAL:
      diType.constantValue = get(tsType, 'value', undefined);
      break;
    case DITypeFlag.BOOLEAN_LITERAL:
      diType.constantValue = get(tsType, 'intrinsicName', undefined) === 'true';
      break;
    case DITypeFlag.ENUM_LITERAL:
      diType.constantValue = get(tsType, 'value', undefined);
      break;
    default:
      return;
    }
  }

  private static trySetTypeArguments(diType: DIType, tsType: ts.Type, resolvedTypeArguments: ts.Type[] | null, genericSymbolLookupTable: WeakMap<ts.Symbol, DIType>): void {
    if (!diType.parsedTSObjectFlags.has(ts.ObjectFlags.Reference)) {
      return;
    }
    const typeChecker = getCompilationContext().typeChecker;

    const typedType = tsType as ts.TypeReference;

    const typeArguments = resolvedTypeArguments ?? Array.from(typeChecker.getTypeArguments(typedType));
    const baseTypeArgumentsLength = typeChecker.getTypeArguments(typedType.target).length;

    //All this stuff needed when a class implements or extends something - it's adding last type argument as this type
    // class A<T> {}
    // class B extends A<string, this <-- ts will add it for some purpose, we need to get rid of it> {}
    if (typeArguments.length === baseTypeArgumentsLength + 1) {
      const lastTypeArgument = typeArguments[typeArguments.length - 1];

      if (lastTypeArgument.isTypeParameter() && lastTypeArgument.isThisType) {
        typeArguments.pop();
      }
    }

    typeArguments.forEach(it => {
      const typeArgument = this._build(it, null, genericSymbolLookupTable);

      diType.typeArguments.push(typeArgument);
    });
  }

  private static setUnionOrIntersectionElements(diType: DIType, tsType: ts.Type, genericSymbolLookupTable: WeakMap<ts.Symbol, DIType>): void {
    if (!diType.isUnionOrIntersection) {
      return;
    }

    const types = (tsType as ts.UnionOrIntersectionType).types ?? [];

    types.forEach(it => {
      const type = this._build(it, null, genericSymbolLookupTable);

      diType.unionOrIntersectionTypes.push(type);
    });
  }

  private static trySetDeclarationInfo(diType: DIType, tsType: ts.Type): void {
    if (!diType.isObject) {
      return;
    }

    const symbol = tsType.aliasSymbol ?? tsType.getSymbol();

    if (!symbol) {
      return;
    }

    const declarations = symbol.getDeclarations() ?? [];

    declarations.forEach(it => {
      const declarationInfo = new DeclarationInfo();
      const {
        fileName,
        hasNoDefaultLib,
      } = it.getSourceFile();
      const modifiers = (ts.canHaveModifiers(it) ? ts.getModifiers(it) : undefined) ?? [];

      declarationInfo.fileName = fileName;
      declarationInfo.isFromDefaultLib = hasNoDefaultLib;
      declarationInfo.isExported = modifiers.some(it => it.kind === ts.SyntaxKind.ExportKeyword);
      declarationInfo.isDefaultExported = modifiers.some(it => declarationInfo.isExported && it.kind === ts.SyntaxKind.DefaultKeyword);

      if (declarationInfo.isDefaultExported) {
        declarationInfo.name = 'default';
      } else {
        const declarationName = (it as ts.NamedDeclaration).name ?? null;

        declarationInfo.name = declarationName && ts.isIdentifier(declarationName) && declarationName.getText() || null;
      }

      let parent: ts.Node = it.parent;
      let moduleName = '';

      while (!ts.isSourceFile(parent)) {
        if (ts.isModuleDeclaration(parent)) {
          moduleName = `${parent.name.getText()}.${moduleName}`;
        }

        parent = parent.parent;
      }

      declarationInfo.moduleName = moduleName || null;

      diType.addDeclaration(declarationInfo);
    });
  }

  private static getObjectFlags(tsType: ts.Type): ts.ObjectFlags | null {
    return tsType.flags & ts.TypeFlags.Object ? (tsType as ts.ObjectType).objectFlags : null;
  }

  private static isTupleType(type: ts.Type): boolean {
    return getCompilationContext().typeChecker.isTupleType(type);

    // const objectFlags = this.getObjectFlags(type);
    // if (objectFlags === null) {
    //   return false;
    // }
    //
    // return !!(objectFlags & ts.ObjectFlags.Reference && (type as ts.TypeReference).objectFlags & ts.ObjectFlags.Tuple);
  }

  private static isReferenceType(type: ts.Type): type is ts.TypeReference {
    const objectFags = this.getObjectFlags(type);

    if (objectFags === null) {
      return false;
    }

    return !!(objectFags & ts.ObjectFlags.Reference);
  }
}
