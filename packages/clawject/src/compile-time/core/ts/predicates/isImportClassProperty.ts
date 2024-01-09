import ts from 'typescript';
import { ClassPropertyWithExpressionInitializer } from '../types';
import { unwrapExpressionFromRoundBrackets } from '../utils/unwrapExpressionFromRoundBrackets';
import { getNodeSourceDescriptor } from '../utils/getNodeSourceDescriptor';

export const isImportClassProperty = (node: ts.Node): node is ClassPropertyWithExpressionInitializer =>
  ts.isPropertyDeclaration(node) && hasImportCallExpression(node);


function hasImportCallExpression(node: ts.PropertyDeclaration): boolean {
  let initializer = node.initializer;

  if (!initializer) {
    return false;
  }

  initializer = unwrapExpressionFromRoundBrackets(initializer);

  if (!ts.isCallExpression(initializer)) {
    return false;
  }

  const nodeSourceDescriptors = getNodeSourceDescriptor(initializer.expression);

  if (nodeSourceDescriptors === null) {
    return false;
  }

  return nodeSourceDescriptors.every(it => it.isLibraryNode && it.originalName === 'Import');
}
