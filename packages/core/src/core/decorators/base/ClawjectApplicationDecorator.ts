import { DecoratorTarget } from '../../../api/decorators/DecoratorTarget';
import { BaseCustomDecorator } from './BaseCustomDecorator';
import { ClawjectDecoratorArgumentError, DecoratorArgumentConstraint } from '../../../api/decorators/DecoratorArgumentConstraint';

export class ClawjectApplicationDecorator extends BaseCustomDecorator {
  name = 'ClawjectApplication';
  uniq = true;
  parents = [];
  targets = [
    DecoratorTarget.Class,
    DecoratorTarget.ConfigurationClass,
    DecoratorTarget.ApplicationClass,
  ];
  argumentConstraints: DecoratorArgumentConstraint[] = [];

  validateArguments(): ClawjectDecoratorArgumentError[] {
    return [];
  }

  protected compatibleDecorators = new Set([
    'Configuration',
    'Lazy',
    'Scope',
    'Internal',
    'External',
  ]);
}
