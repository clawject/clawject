import ts from 'typescript';
import { DeclarationInfo } from './DeclarationInfo';
import { TypeCompatibilityMatrix } from './TypeCompatibilityMatrix';
import { DITypeFlag } from './DITypeFlag';
import { escape } from 'lodash';
import { BaseTypesRepository } from './BaseTypesRepository';

export class DIType {
  declare tsTypeFlags: ts.TypeFlags;
  declare parsedTSTypeFlags: Set<ts.TypeFlags>;
  tsObjectFlags: ts.ObjectFlags | null = null;
  parsedTSObjectFlags = new Set<ts.ObjectFlags>();
  typeFlag: DITypeFlag = DITypeFlag.UNSUPPORTED;
  constantValue: string | number | ts.PseudoBigInt | boolean | undefined = undefined;
  typeArguments: DIType[] = [];
  unionOrIntersectionTypes: DIType[] = [];
  declarations: DeclarationInfo[] = [];

  get declarationFileNames(): string[] {
    return this.declarations.map(it => it.fileName);
  }

  //For debug purpose only
  get name(): string | null {
    return Object.entries(DITypeFlag).find(it => it[1] === this.typeFlag)?.[0] ?? null;
  }

  get isAny(): boolean {
    return this.typeFlag === DITypeFlag.ANY;
  }

  get isUnknown(): boolean {
    return this.typeFlag === DITypeFlag.UNKNOWN;
  }

  get isPrimitive(): boolean {
    return this.typeFlag >= DITypeFlag.ANY && this.typeFlag <= DITypeFlag.BIGINT;
  }

  get isVoidUndefinedPlainUnionIntersection(): boolean {
    if (this.typeFlag === DITypeFlag.UNDEFINED || this.typeFlag === DITypeFlag.VOID) {
      return true;
    }

    return this.isUnionOrIntersection && this.unionOrIntersectionTypes.every(it => it.isVoidUndefinedPlainUnionIntersection);
  }

  get isNull(): boolean {
    return this.typeFlag === DITypeFlag.NULL;
  }

  get isLiteral(): boolean {
    return this.typeFlag >= DITypeFlag.STRING_LITERAL && this.typeFlag <= DITypeFlag.BIGINT_LITERAL;
  }

  get isObject(): boolean {
    return this.typeFlag === DITypeFlag.OBJECT;
  }

  get isUnion(): boolean {
    return this.typeFlag === DITypeFlag.UNION;
  }

  get isIntersection(): boolean {
    return this.typeFlag === DITypeFlag.INTERSECTION;
  }

  get isUnionOrIntersection(): boolean {
    return this.isUnion || this.isIntersection;
  }

  get isTuple(): boolean {
    return this.typeFlag === DITypeFlag.TUPLE;
  }

  get isArray(): boolean {
    return BaseTypesRepository.getBaseTypes().Array.isCompatible(this);
  }

  get isSet(): boolean {
    return BaseTypesRepository.getBaseTypes().Set.isCompatible(this);
  }

  get isMap(): boolean {
    return BaseTypesRepository.getBaseTypes().Map.isCompatible(this);
  }

  get isMapStringToAny(): boolean {
    return BaseTypesRepository.getBaseTypes().MapStringToAny.isCompatible(this);
  }

  get isOptionalUndefined(): boolean {
    return this.isUnion && this.unionOrIntersectionTypes.some(it => it.isVoidUndefinedPlainUnionIntersection);
  }

  get isOptionalNull(): boolean {
    return this.isUnion && this.unionOrIntersectionTypes.some(it => it.isNull);
  }

  get isOptional(): boolean {
    return this.isOptionalUndefined || this.isOptionalNull;
  }

  private get id(): string {
    /**
     * tf - type flag
     * cvt - constant value type
     * cv - constant value
     * d - declarations
     * ta - type arguments
     * u - union
     * i - intersection
     * */
    const typeFlag = this.typeFlag.toString();
    const constantValueType = typeof this.constantValue;
    const constantValue = this.constantValue?.toString() ?? '';
    const declarations = this.declarations.map(it => `<d>${it.toString()}</d>`).join('');
    const typeArguments = this.typeArguments.map(it => `<ta>${it.id}</ta>`).join('');
    const unionOrIntersectionTypes = this.unionOrIntersectionTypes.map(it => {
      const tag = this.typeFlag === DITypeFlag.UNION ? 'u' : 'i';
      return `<${tag}>${it.id}</${tag}>`;
    }).join();

    return `<tf>${escape(typeFlag)}</tf>` +
      `<cvt>${constantValueType}</cvt>` +
      `<cv>${escape(constantValue)}</cv>` +
      `${declarations}` +
      `${typeArguments}` +
      `${unionOrIntersectionTypes}`;
  }

  addDeclaration(declaration: DeclarationInfo): void {
    this.declarations.push(declaration);
    this.declarations.sort((a, b) => a.compareTo(b));
  }

  isCompatible(to: DIType): boolean {
    if (this.typeFlag === DITypeFlag.UNSUPPORTED || to.typeFlag === DITypeFlag.UNSUPPORTED) {
      return false;
    }

    if (this.isAny || this.isUnknown) {
      return true;
    }

    //If both are primitive types, we can stop here
    if (this.isPrimitive && (to.isPrimitive || to.isLiteral)) {
      return TypeCompatibilityMatrix.isCompatible(this.typeFlag, to.typeFlag);
    }

    //If this is literal type, and other, as well, we can stop here
    if (this.isLiteral && this.typeFlag === to.typeFlag && this.constantValue !== undefined) {
      if (this.typeFlag === DITypeFlag.BIGINT_LITERAL) {
        const thisValue = this.constantValue as ts.PseudoBigInt;
        const otherValue = to.constantValue as ts.PseudoBigInt;

        return thisValue.negative === otherValue.negative && thisValue.base10Value === otherValue.base10Value;
      }

      return this.constantValue === to.constantValue;
    }

    //Unions and intersections
    if (to.isUnion) {
      return false;
    }

    if (this.isIntersection && to.isIntersection) {
      return this.unionOrIntersectionTypes.every(it => {
        return to.unionOrIntersectionTypes.some(toIt => it.isCompatible(toIt));
      });
    }

    if (this.isIntersection) {
      return this.unionOrIntersectionTypes.every(it => it.isCompatible(to));
    }

    if (this.isUnion && to.isIntersection) {
      return this.unionOrIntersectionTypes.some(it => {
        return to.unionOrIntersectionTypes.some(toType => it.isCompatible(toType));
      });
    }

    if (this.isUnion) {
      return this.unionOrIntersectionTypes.some(it => it.isCompatible(to));
    }

    if (to.isIntersection) {
      return to.unionOrIntersectionTypes.some(it => this.isCompatible(it));
    }

    if (this.isTuple && to.isTuple) {
      if (this.typeArguments.length !== to.typeArguments.length) {
        return false;
      }

      return this.typeArguments.every((it, index) => {
        return it.isCompatible(to.typeArguments[index]);
      });
    }

    //Objects
    if (this.isObject) {
      if (this.declarations.length === 0) {
        return false;
      }

      //Need to check if all declarations from current time exists in other type
      const isEveryDeclarationInOtherType = this.declarations.every(it => {
        return to.declarations.some(to => it.equals(to));
      });

      if (!isEveryDeclarationInOtherType) {
        return false;
      }

      if (this.typeArguments.length !== to.typeArguments.length) {
        return false;
      }

      return this.typeArguments.every((it, index) => {
        return it.isCompatible(to.typeArguments[index]);
      });
    }

    return false;
  }
}
