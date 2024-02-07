import ts, { factory } from 'typescript';
import { isArray, isObject } from 'lodash';
import { createBoolean } from './createBoolean';

export const valueToAST = (value: any): ts.Expression => {
  if (typeof value === 'string') {
    return factory.createStringLiteral(value);
  }

  if (typeof value === 'number') {
    return factory.createNumericLiteral(value);
  }

  if (typeof value === 'boolean') {
    return createBoolean(value);
  }

  if (value === null) {
    return factory.createNull();
  }

  if (value === undefined) {
    return factory.createIdentifier('undefined');
  }

  if (ts.isExpression(value)) {
    return value;
  }

  if (isArray(value)) {
    const elements = value.map((value) => {
      return valueToAST(value);
    });

    return factory.createArrayLiteralExpression(elements, true);
  }

  if (isObject(value)) {
    const values = Object.entries(value).map(([key, value]) => {
      return factory.createPropertyAssignment(
        factory.createIdentifier(key),
        valueToAST(value)
      );
    });

    return factory.createObjectLiteralExpression(values, true);
  }

  throw new Error(`Unsupported value type: ${typeof value}, value: ${value}`);
};
