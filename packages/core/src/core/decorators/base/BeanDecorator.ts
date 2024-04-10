import { DecoratorParent } from '../../../api/decorators/DecoratorParent';
import { DecoratorTarget } from '../../../api/decorators/DecoratorTarget';
import { BaseCustomDecorator } from './BaseCustomDecorator';
import { ClawjectDecoratorArgumentError } from '../../../api/decorators/DecoratorArgumentConstraint';

export class BeanDecorator extends BaseCustomDecorator {
  name = 'Bean';
  uniq = true;
  parents = [DecoratorParent.ConfigurationClass, DecoratorParent.ApplicationClass];
  targets = [
    DecoratorTarget.ClassProperty,
    DecoratorTarget.ClassFunction,
    DecoratorTarget.Bean,
  ];
  argumentConstraints = [];

  validateArguments(): ClawjectDecoratorArgumentError[] {
    return [];
  }

  protected compatibleDecorators = new Set([
    'Embedded',
    'Lazy',
    'Scope',
    'Primary',
    'Qualifier',
    'Internal',
    'External',
  ]);
}
