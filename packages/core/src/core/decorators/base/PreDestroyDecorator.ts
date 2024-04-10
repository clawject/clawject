import { DecoratorParent } from '../../../api/decorators/DecoratorParent';
import { DecoratorTarget } from '../../../api/decorators/DecoratorTarget';
import { BaseCustomDecorator } from './BaseCustomDecorator';
import { ClawjectDecoratorArgumentError } from '../../../api/decorators/DecoratorArgumentConstraint';

export class PreDestroyDecorator extends BaseCustomDecorator {
  name = 'PreDestroy';
  uniq = true;
  parents = [
    DecoratorParent.ApplicationClass,
    DecoratorParent.ConfigurationClass,
    DecoratorParent.AnyClass
  ];
  targets = [
    DecoratorTarget.ClassFunction,
  ];
  argumentConstraints = [];

  validateArguments(): ClawjectDecoratorArgumentError[] {
    return [];
  }

  protected compatibleDecorators= new Set([
    'PostConstruct',
  ]);
}
