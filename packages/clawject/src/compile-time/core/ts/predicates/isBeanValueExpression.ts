import ts, { PropertyDeclaration } from 'typescript';
import { extractDecoratorMetadata } from '../../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../../decorator-processor/DecoratorKind';
import { MissingInitializerError } from '../../../compilation-context/messages/errors/MissingInitializerError';
import { getCompilationContext } from '../../../../transformer/getCompilationContext';

export const isBeanValueExpression = (
  node: ts.Node
): node is PropertyDeclaration => {
  if (!ts.isPropertyDeclaration(node)) {
    return false;
  }

  const decoratorMetadata = extractDecoratorMetadata(node, DecoratorKind.Bean);

  if (decoratorMetadata === null) {
    return false;
  }

  if (node.initializer === undefined) {
    getCompilationContext().report(new MissingInitializerError(
      null,
      node,
      null,
    ));
    return false;
  }

  return !ts.isArrowFunction(node.initializer);
};