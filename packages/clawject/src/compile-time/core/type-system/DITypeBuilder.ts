import ts, { isThisTypeParameter, ObjectFlags, TypeFlags } from 'typescript';
import { DIType } from './DIType';
import { parseFlags } from '../ts/flags/parseFlags';
import { DITypeFlag } from './DITypeFlag';
import { DeclarationInfo } from './DeclarationInfo';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { get } from 'lodash';
import { isNotEmpty } from '../utils/isNotEmpty';

/**
 * notes:
 * If hasNoDefaultLib is true in source file - that means source file is lib file
 *
 * Type diagram https://user-images.githubusercontent.com/442988/78500144-86799400-775d-11ea-8e2b-52feeec6d39f.png
 * */

class TypeWithTypeArguments {
  constructor(
    public typeSymbol: ts.Symbol | undefined,
    public typeArguments: ts.Type[],
  ) {}

  equals(other: TypeWithTypeArguments): boolean {
    return this.typeSymbol === other.typeSymbol &&
      this.typeArguments.length === other.typeArguments.length &&
      this.typeArguments.every((it, i) => it === other.typeArguments[i]);
  }
}

export class DITypeBuilder {
  static getAwaitedType(tsType: ts.Type): ts.Type | null {
    const typeChecker = getCompilationContext().typeChecker;
    return typeChecker.getAwaitedType(tsType) ?? null;

    // Use this code if ts compiler will remove support for getAwaitedType
    // const diType = this.build(tsType);
    //
    // if (diType.isPromise) {
    //   return typeChecker.getTypeArguments(tsType as ts.TypeReference)[0] ?? null;
    // }
    //
    // return tsType;
  }

  static build(tsType: ts.Type): DIType {
    let type = tsType;
    const typeChecker = getCompilationContext().typeChecker;
    const objectFlags = this.getObjectFlagsSet(type);
    const typeFlags = new Set(parseFlags(ts.TypeFlags, type.getFlags()));

    if (typeFlags.has(ts.TypeFlags.TypeParameter) && typeFlags.has(ts.TypeFlags.IncludesMissingType)) {
      type = typeChecker.getDefaultFromTypeParameter(type) ?? typeChecker.getBaseConstraintOfType(type) ?? type;
    }

    //TODO maybe handle type alliases in the future
    // const isAlias = type.aliasSymbol !== undefined;
    //
    // if (isAlias) {
    //   const resolvedTypeArguments = type.aliasTypeArguments ?? [];
    //
    //   return this._build(type, resolvedTypeArguments as ts.Type[]);
    // }

    if (objectFlags.size === 0) {
      return this._build(type, null);
    }

    if (this.isTupleType(type)) {
      return this._build(type, typeChecker.getTypeArguments(type as ts.TypeReference) as ts.Type[]);
    }

    if (!objectFlags.has(ObjectFlags.Reference) && !objectFlags.has(ObjectFlags.ClassOrInterface)) {
      return this._build(type, null);
    }

    const baseType = type as ts.TypeReference;
    const baseTypeArguments = typeChecker.getTypeArguments(baseType).filter(it => {
      return !isThisTypeParameter(it);
    });
    const baseTypeSymbol = baseType.getSymbol();
    const processedElements: TypeWithTypeArguments[] = [];
    const stack: TypeWithTypeArguments[] = [
      new TypeWithTypeArguments(baseTypeSymbol, baseTypeArguments as ts.Type[])
    ];

    while (stack.length > 0) {
      const typeWithTypeArguments = stack.pop()!;
      const {typeSymbol, typeArguments} = typeWithTypeArguments;
      processedElements.push(typeWithTypeArguments);

      if (!typeSymbol) {
        return this.unknown();
      }

      typeSymbol.getDeclarations()?.forEach((declaration, index) => {
        //  || ts.isTypeAliasDeclaration(declaration)
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
              if (isThisTypeParameter(type)) {
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

            const typeWithTypeArguments = new TypeWithTypeArguments(memberSymbol, memberTypeArguments);

            if (processedElements.some(it => it.equals(typeWithTypeArguments))) {
              return;
            } else {
              stack.push(new TypeWithTypeArguments(memberSymbol, memberTypeArguments));
            }
          });
        }
      });
    }

    const diTypes = processedElements.map(it => {
      if (!it.typeSymbol) {
        return;
      }

      return it.typeSymbol.getDeclarations()?.map(declaration => {
        return this._build(typeChecker.getTypeAtLocation(declaration), it.typeArguments);
      });
    }).filter(it => it !== undefined).flat() as DIType[];

    return this.buildSyntheticIntersectionOrPlain(diTypes);
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

  private static _build(tsType: ts.Type, resolvedTypeArguments: ts.Type[] | null): DIType {
    const diType = new DIType();

    this.setTSFlags(diType, tsType);
    this.setTypeFlag(diType, tsType);
    this.trySetConstantValue(diType, tsType);
    this.trySetTypeArguments(diType, resolvedTypeArguments);
    this.setUnionOrIntersectionElements(diType, tsType);
    this.trySetDeclarationInfo(diType, tsType);

    return diType;
  }

  private static setTSFlags(diType: DIType, tsType: ts.Type): void {
    diType.tsTypeFlags = tsType.getFlags();
    diType.parsedTSTypeFlags = new Set(parseFlags(ts.TypeFlags, tsType.getFlags()));

    diType.tsObjectFlags = this.getObjectFlags(tsType);
    diType.parsedTSObjectFlags = this.getObjectFlagsSet(tsType);
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
    case diType.parsedTSTypeFlags.has(TypeFlags.UniqueESSymbol):
      diType.typeFlag = DITypeFlag.UNIQUE_SYMBOL;
      break;
    case diType.parsedTSTypeFlags.has(TypeFlags.ESSymbol):
      diType.typeFlag = DITypeFlag.SYMBOL;
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
      diType.typeFlag = DITypeFlag.TYPE_REFERENCE;
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

  private static trySetTypeArguments(diType: DIType, resolvedTypeArguments: ts.Type[] | null): void {
    resolvedTypeArguments?.forEach(it => {
      diType.typeArguments.push(this.build(it));
    });
  }

  private static setUnionOrIntersectionElements(diType: DIType, tsType: ts.Type): void {
    if (!diType.isUnionOrIntersection) {
      return;
    }

    const types = (tsType as ts.UnionOrIntersectionType).types ?? [];

    types.forEach(it => {
      const typeArguments = this.isReferenceType(it)
        ? getCompilationContext().typeChecker.getTypeArguments(it)
        : null;
      const type = this._build(
        it,
        typeArguments as ts.Type[] | null
      );

      diType.unionOrIntersectionTypes.push(type);
    });
  }

  private static trySetDeclarationInfo(diType: DIType, tsType: ts.Type): void {
    if (!diType.isTypeReferenceOrUniqueSymbol) {
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

  static getObjectFlags(tsType: ts.Type): ts.ObjectFlags | null {
    return tsType.flags & ts.TypeFlags.Object ? (tsType as ts.ObjectType).objectFlags : null;
  }

  static getObjectFlagsSet(tsType: ts.Type): Set<ts.ObjectFlags> {
    const objectFlags = this.getObjectFlags(tsType);

    if (objectFlags === null) {
      return new Set();
    }

    return new Set(parseFlags(ts.ObjectFlags, objectFlags));
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
