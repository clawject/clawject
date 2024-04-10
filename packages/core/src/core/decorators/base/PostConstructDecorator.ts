import { DecoratorParent } from '../../../api/decorators/DecoratorParent';
import { DecoratorTarget } from '../../../api/decorators/DecoratorTarget';
import { BaseCustomDecorator } from './BaseCustomDecorator';
import { ClawjectDecoratorArgumentError, DecoratorArgumentConstraint } from '../../../api/decorators/DecoratorArgumentConstraint';

export class PostConstructDecorator extends BaseCustomDecorator {
  name = 'PostConstruct';
  uniq = true;
  parents = [
    DecoratorParent.ConfigurationClass,
    DecoratorParent.ApplicationClass,
    DecoratorParent.AnyClass,
  ];
  targets = [
    DecoratorTarget.ClassFunction,
  ];
  argumentConstraints: DecoratorArgumentConstraint[] = [];

  validateArguments(): ClawjectDecoratorArgumentError[] {
    return [];
  }

  protected compatibleDecorators= new Set([
    'PreDestroy',
  ]);
}
