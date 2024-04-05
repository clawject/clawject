import type * as ts from 'typescript';
import { extractDecoratorMetadata } from '../../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../../decorator-processor/DecoratorKind';
import { MissingInitializerError } from '../../../compilation-context/messages/errors/MissingInitializerError';
import { Context } from '../../../compilation-context/Context';

export const isBeanValueExpression = (
  node: ts.Node
): node is ts.PropertyDeclaration | ts.GetAccessorDeclaration => {
  if (!Context.ts.isPropertyDeclaration(node) && !Context.ts.isGetAccessorDeclaration(node)) {
    return false;
  }

  const decoratorMetadata = extractDecoratorMetadata(node, DecoratorKind.Bean);

  if (decoratorMetadata === null) {
    return false;
  }

  if (Context.ts.isGetAccessorDeclaration(node)) {
    return true;
  }

  if (node.initializer === undefined) {
    Context.report(new MissingInitializerError(
      null,
      node,
      null,
      null,
    ));
    return false;
  }

  return !Context.ts.isArrowFunction(node.initializer);
};
