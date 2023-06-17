import ts, { CallExpression, PropertyDeclaration } from 'typescript';

export interface NamedClassDeclaration extends ts.ClassDeclaration {
    name: ts.Identifier;
}

export interface ClassPropertyWithCallExpressionInitializer extends PropertyDeclaration {
    initializer: CallExpression;
}

export interface ClassPropertyWithArrowFunctionInitializer extends PropertyDeclaration {
    initializer: ts.ArrowFunction;
}

export interface ClassPropertyWithExpressionInitializer extends PropertyDeclaration {
    initializer: ts.Expression;
}
