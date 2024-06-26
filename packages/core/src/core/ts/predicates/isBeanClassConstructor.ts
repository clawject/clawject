import type * as ts from 'typescript';
import { ClassPropertyWithCallExpressionInitializer } from '../types';
import { getNodeSourceDescriptor } from '../utils/getNodeSourceDescriptor';
import { unwrapExpressionFromRoundBrackets } from '../utils/unwrapExpressionFromRoundBrackets';
import { Context } from '../../../compilation-context/Context';

export const isBeanClassConstructor = (node: ts.Node): node is ClassPropertyWithCallExpressionInitializer =>
  Context.ts.isPropertyDeclaration(node) && hasBeanCallExpression(node);

function hasBeanCallExpression(node: ts.PropertyDeclaration): boolean {
  let initializer = node.initializer;

  if (initializer === undefined) {
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

  return nodeSourceDescriptors.every(it => it.isLibraryNode && it.originalName === 'Bean');
}
