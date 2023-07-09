import ts from 'typescript';

export const createBoolean = (value: boolean): ts.BooleanLiteral => value ?
  ts.factory.createTrue() : ts.factory.createFalse();
