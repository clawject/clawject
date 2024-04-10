import type * as ts from 'typescript';
import { isArray, isObject } from 'lodash';
import { createBoolean } from './createBoolean';
import { Context } from '../../../compilation-context/Context';

export const valueToASTExpression = (value: any, multiline: boolean = true): ts.Expression => {
  if (typeof value === 'string') {
    return Context.factory.createStringLiteral(value);
  }

  if (typeof value === 'number') {
    return Context.factory.createNumericLiteral(value);
  }

  if (typeof value === 'boolean') {
    return createBoolean(value);
  }

  if (value === null) {
    return Context.factory.createNull();
  }

  if (value === undefined) {
    return Context.factory.createIdentifier('undefined');
  }

  if (Context.ts.isExpression(value)) {
    return value;
  }

  if (isArray(value)) {
    const elements = value.map((value) => {
      return valueToASTExpression(value);
    });

    return Context.factory.createArrayLiteralExpression(elements, multiline);
  }

  if (isObject(value)) {
    const values = Object.entries(value).map(([key, value]) => {
      return Context.factory.createPropertyAssignment(
        Context.factory.createIdentifier(key),
        valueToASTExpression(value)
      );
    });

    return Context.factory.createObjectLiteralExpression(values, multiline);
  }

  throw new Error(`Unsupported value type: ${typeof value}, value: ${value}`);
};
