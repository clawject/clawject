import type ts from 'typescript';
import { ClassPropertyWithExpressionInitializer } from '../types';
import { unwrapExpressionFromRoundBrackets } from '../utils/unwrapExpressionFromRoundBrackets';
import { getNodeSourceDescriptor } from '../utils/getNodeSourceDescriptor';
import { Context } from '../../../compilation-context/Context';

export const isImportClassProperty = (node: ts.Node): node is ClassPropertyWithExpressionInitializer =>
  Context.ts.isPropertyDeclaration(node) && hasImportCallExpression(node);


function hasImportCallExpression(node: ts.PropertyDeclaration): boolean {
  let initializer = node.initializer;

  if (!initializer) {
    return false;
  }

  initializer = unwrapExpressionFromRoundBrackets(initializer);

  if (!Context.ts.isCallExpression(initializer)) {
    return false;
  }

  const nodeSourceDescriptors = getNodeSourceDescriptor(initializer.expression);

  if (nodeSourceDescriptors === null) {
    return false;
  }

  return nodeSourceDescriptors.every(it => it.isLibraryNode && it.originalName === 'Import');
}
