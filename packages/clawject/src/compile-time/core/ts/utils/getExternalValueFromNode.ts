import ts from 'typescript';
import { DecoratorMetadata, extractDecoratorMetadata } from '../../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../../decorator-processor/DecoratorKind';

export const getExternalValueFromNode = (node: ts.Node): boolean | null => {
  const externalDecoratorMetadata = extractDecoratorMetadata(node, DecoratorKind.External);
  const internalDecoratorMetadata = extractDecoratorMetadata(node, DecoratorKind.Internal);

  return getValueFromMetadata(externalDecoratorMetadata, DecoratorKind.External) ?? getValueFromMetadata(internalDecoratorMetadata, DecoratorKind.Internal);
};

function getValueFromMetadata(metadata: DecoratorMetadata | null, decoratorKind: DecoratorKind.External | DecoratorKind.Internal): boolean | null {
  if (metadata === null) {
    return null;
  }

  const args = metadata.args;

  if (args.length === 0) {
    return decoratorKind === DecoratorKind.External;
  }

  const expression = args[0];

  if (expression.kind === ts.SyntaxKind.TrueKeyword) {
    return decoratorKind === DecoratorKind.External;
  }

  if (expression.kind === ts.SyntaxKind.FalseKeyword) {
    return decoratorKind !== DecoratorKind.External;
  }

  return null;
}
