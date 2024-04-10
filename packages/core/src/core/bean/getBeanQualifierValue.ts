import { Bean } from './Bean';
import { DecoratorProcessor } from '../decorators/DecoratorProcessor';
import { BaseDecorators } from '../decorators/BaseDecorators';

export const getBeanQualifierValue = (bean: Bean): string | null => {
  const decoratorEntity = DecoratorProcessor.extractFirstDecoratorEntity(bean.node, BaseDecorators.Qualifier);

  if (decoratorEntity === null) {
    return null;
  }

  return (decoratorEntity.staticallyKnownArgs[0] ?? null) as string | null;
};
