import ts from 'typescript';
import { ClassPropertyWithExpressionInitializer } from '../types';
import { extractDecoratorMetadata } from '../../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../../decorator-processor/DecoratorKind';

export const isImportClassProperty = (node: ts.Node): node is ClassPropertyWithExpressionInitializer =>
  extractDecoratorMetadata(node, DecoratorKind.Imports) !== null
  && ts.isPropertyDeclaration(node)
  && node.initializer !== undefined;
