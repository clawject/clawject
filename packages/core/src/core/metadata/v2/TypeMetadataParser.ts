import type ts from 'typescript';
import { Context } from '../../../compilation-context/Context';
import { get } from 'lodash';

//TODO rename
export class TypeMetadataParser {
  static readonly AnySymbol = Symbol('Any type');

  static getBoolean(type: ts.Type | null | undefined): boolean | null {
    if (!type) {
      return null;
    }

    if (type.flags & Context.ts.TypeFlags.Any) {
      return null;
    }

    if (type.flags & Context.ts.TypeFlags.BooleanLiteral) {
      const intrinsicName = get(type, 'intrinsicName');

      if (intrinsicName === 'true') {
        return true;
      }

      if (intrinsicName === 'false') {
        return false;
      }

      return null;
    }

    return null;
  }

  static getString(type: ts.Type | null | undefined): string | null {
    if (!type) {
      return null;
    }

    if (type.flags & Context.ts.TypeFlags.Any) {
      return null;
    }

    if (!type.isStringLiteral()) {
      return null;
    }

    return type.value;
  }

  static getStringArray(type: ts.Type | null | undefined): string[] | null {
    if (!type) {
      return null;
    }

    if (!Context.typeChecker.isTupleType(type)) {
      return null;
    }

    const tupleTypeArguments = Context.typeChecker.getTypeArguments(type as ts.TypeReference);
    const result: string[] = [];

    for (const typeArgument of tupleTypeArguments) {
      const stringValue = TypeMetadataParser.getString(typeArgument);
      if (stringValue !== null) {
        result.push(stringValue);
      } else {
        return null;
      }
    }

    return result;
  }

  static getTypeHolderType(type: ts.Type | null | undefined): ts.Type | null {
    if (!type) {
      return null;
    }

    const callSignatures = type.getCallSignatures();

    if (callSignatures.length !== 1) {
      return null;
    }

    return callSignatures[0].getReturnType();
  }

  static getArrayTypeHolderType(type: ts.Type | null | undefined): ts.Type[] | null {
    if (!type) {
      return null;
    }

    const heldType = this.getTypeHolderType(type);

    if (!heldType) {
      return null;
    }

    if (!Context.typeChecker.isTupleType(heldType)) {
      return null;
    }

    return Array.from(Context.typeChecker.getTypeArguments(heldType as ts.TypeReference));
  }
}
