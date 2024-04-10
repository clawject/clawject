import type * as ts from 'typescript';
import { isArray, isObject } from 'lodash';
import { createBoolean } from './createBoolean';
import { Context } from '../../../compilation-context/Context';

export const valueToASTType = (value: any): ts.TypeNode => {
  if (typeof value === 'string') {
    return Context.factory.createLiteralTypeNode(Context.factory.createStringLiteral(value));
  }

  if (typeof value === 'number') {
    return Context.factory.createLiteralTypeNode(Context.factory.createNumericLiteral(value));
  }

  if (typeof value === 'boolean') {
    return Context.factory.createLiteralTypeNode(createBoolean(value));
  }

  if (value === null) {
    return Context.factory.createLiteralTypeNode(Context.factory.createNull());
  }

  if (value === undefined) {
    return Context.factory.createKeywordTypeNode(Context.ts.SyntaxKind.UndefinedKeyword);
  }

  if (Context.ts.isTypeNode(value)) {
    return value;
  }

  if (isArray(value)) {
    const elements = value.map((value) => {
      return valueToASTType(value);
    });

    return Context.factory.createTupleTypeNode(elements);
  }

  if (isObject(value)) {
    const values = Object.entries(value).map(([key, value]) => {
      return Context.factory.createPropertySignature(
        undefined,
        Context.factory.createIdentifier(key),
        undefined,
        valueToASTType(value),
      );
    });

    return Context.factory.createTypeLiteralNode(values);
  }

  throw new Error(`Unsupported value type: ${typeof value}, value: ${value}`);
};
