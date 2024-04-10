import type * as ts from 'typescript';

export interface ClassPropertyWithCallExpressionInitializer extends ts.PropertyDeclaration {
  initializer: ts.CallExpression;
}

export interface ClassPropertyWithArrowFunctionInitializer extends ts.PropertyDeclaration {
  initializer: ts.ArrowFunction;
}

export interface ClassPropertyWithExpressionInitializer extends ts.PropertyDeclaration {
  initializer: ts.Expression;
}

