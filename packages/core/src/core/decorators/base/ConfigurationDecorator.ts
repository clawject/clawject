import { DecoratorTarget } from '../../../api/decorators/DecoratorTarget';
import { BaseCustomDecorator } from './BaseCustomDecorator';
import { ClawjectDecoratorArgumentError } from '../../../api/decorators/DecoratorArgumentConstraint';

export class ConfigurationDecorator extends BaseCustomDecorator {
  name = 'Configuration';
  uniq = true;
  parents = [];
  targets = [
    DecoratorTarget.Class,
    DecoratorTarget.ConfigurationClass,
    DecoratorTarget.ApplicationClass,
  ];
  argumentConstraints = [];

  validateArguments(): ClawjectDecoratorArgumentError[] {
    return [];
  }

  protected compatibleDecorators = new Set([
    'Lazy',
    'Scope',
    'ClawjectApplication',
    'Internal',
    'External',
  ]);
}
