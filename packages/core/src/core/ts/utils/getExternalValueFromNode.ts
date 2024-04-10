import type * as ts from 'typescript';
import { DecoratorEntity } from '../../decorators/DecoratorEntity';
import { DecoratorProcessor } from '../../decorators/DecoratorProcessor';
import { BaseDecorators } from '../../decorators/BaseDecorators';

export const getExternalValueFromNode = (node: ts.Node): boolean | null => {
  const externalDecoratorEntity = DecoratorProcessor.extractFirstDecoratorEntity(node, BaseDecorators.External);
  const internalDecoratorEntity = DecoratorProcessor.extractFirstDecoratorEntity(node, BaseDecorators.Internal);

  return getValueFromMetadata(externalDecoratorEntity, 'External') ?? getValueFromMetadata(internalDecoratorEntity, 'Internal');
};

function getValueFromMetadata(entity: DecoratorEntity | null, decoratorKind: 'External' | 'Internal'): boolean | null {
  if (entity === null) {
    return null;
  }

  const args = entity.staticallyKnownArgs;

  if (args.length === 0) {
    return decoratorKind === 'External';
  }

  return (args[0] ?? null) as boolean | null;
}
