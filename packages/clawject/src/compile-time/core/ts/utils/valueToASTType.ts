import ts, { factory } from 'typescript';
import { isArray, isObject } from 'lodash';
import { createBoolean } from './createBoolean';

export const valueToASTType = (value: any): ts.TypeNode => {
  if (typeof value === 'string') {
    return factory.createLiteralTypeNode(factory.createStringLiteral(value));
  }

  if (typeof value === 'number') {
    return factory.createLiteralTypeNode(factory.createNumericLiteral(value));
  }

  if (typeof value === 'boolean') {
    return factory.createLiteralTypeNode(createBoolean(value));
  }

  if (value === null) {
    return factory.createLiteralTypeNode(factory.createNull());
  }

  if (value === undefined) {
    return factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword);
  }

  if (ts.isTypeNode(value)) {
    return value;
  }

  if (isArray(value)) {
    const elements = value.map((value) => {
      return valueToASTType(value);
    });

    return factory.createTupleTypeNode(elements);
  }

  if (isObject(value)) {
    const values = Object.entries(value).map(([key, value]) => {
      return factory.createPropertySignature(
        undefined,
        factory.createIdentifier(key),
        undefined,
        valueToASTType(value),
      );
    });

    return factory.createTypeLiteralNode(values);
  }

  throw new Error(`Unsupported value type: ${typeof value}, value: ${value}`);
};
