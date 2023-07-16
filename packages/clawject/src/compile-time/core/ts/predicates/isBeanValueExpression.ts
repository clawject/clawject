import ts, { PropertyDeclaration } from 'typescript';
import { MissingInitializerError } from '../../../compilation-context/messages/errors/MissingInitializerError';
import { Configuration } from '../../configuration/Configuration';
import { extractDecoratorMetadata } from '../../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../../decorator-processor/DecoratorKind';
import { getCompilationContext } from '../../../../transformer/getCompilationContext';

export const isBeanValueExpression = (
  configuration: Configuration,
  node: ts.Node
): node is PropertyDeclaration => {
  const compilationContext = getCompilationContext();
  if (!ts.isPropertyDeclaration(node)) {
    return false;
  }

  const decoratorMetadata = extractDecoratorMetadata(node, DecoratorKind.Bean);

  if (decoratorMetadata === null) {
    return false;
  }

  if (node.initializer === undefined) {
    compilationContext.report(new MissingInitializerError(
      null,
      node,
      configuration,
    ));

    return false;
  }

  return !ts.isArrowFunction(node.initializer);
};
