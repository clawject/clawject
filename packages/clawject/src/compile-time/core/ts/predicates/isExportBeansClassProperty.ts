import ts from 'typescript';
import { ClassPropertyWithExpressionInitializer } from '../types';
import { unwrapExpressionFromRoundBrackets } from '../utils/unwrapExpressionFromRoundBrackets';
import { getNodeSourceDescriptor } from '../utils/getNodeSourceDescriptor';

export const isExportBeansClassProperty = (node: ts.Node): node is ClassPropertyWithExpressionInitializer =>
  ts.isPropertyDeclaration(node) && hasExportBeansClassProperty(node);


function hasExportBeansClassProperty(node: ts.PropertyDeclaration): boolean {
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

  return nodeSourceDescriptors.every(it => it.isLibraryNode && it.originalName === 'ExportBeans');
}
