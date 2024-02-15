import ts, { PropertyDeclaration, GetAccessorDeclaration } from 'typescript';
import { extractDecoratorMetadata } from '../../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../../decorator-processor/DecoratorKind';
import { MissingInitializerError } from '../../../compilation-context/messages/errors/MissingInitializerError';
import { getCompilationContext } from '../../../../transformer/getCompilationContext';

export const isBeanValueExpression = (
  node: ts.Node
): node is PropertyDeclaration | GetAccessorDeclaration => {
  if (!ts.isPropertyDeclaration(node) && !ts.isGetAccessorDeclaration(node)) {
    return false;
  }

  const decoratorMetadata = extractDecoratorMetadata(node, DecoratorKind.Bean);

  if (decoratorMetadata === null) {
    return false;
  }

  if (ts.isGetAccessorDeclaration(node)) {
    return true;
  }

  if (node.initializer === undefined) {
    getCompilationContext().report(new MissingInitializerError(
      null,
      node,
      null,
      null,
    ));
    return false;
  }

  return !ts.isArrowFunction(node.initializer);
};
