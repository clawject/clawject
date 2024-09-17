import { DecoratorParent } from '../../../api/decorators/DecoratorParent';
import { DecoratorTarget } from '../../../api/decorators/DecoratorTarget';
import { BaseCustomDecorator } from './BaseCustomDecorator';
import { ClawjectDecoratorArgumentError } from '../../../api/decorators/DecoratorArgumentConstraint';

export class FactoryDecorator extends BaseCustomDecorator {
  name = 'Factory';
  uniq = true;
  parents = [
    DecoratorParent.ConfigurationClass,
    DecoratorParent.ApplicationClass,
  ];
  targets = [
    DecoratorTarget.Bean,
  ];
  argumentConstraints = [];

  validateArguments(): ClawjectDecoratorArgumentError[] {
    return [];
  }

  protected compatibleDecorators= new Set([
    'Bean',
    'Lazy',
    'Scope',
    'Primary',
    'Qualifier',
    'Internal',
    'External',
    'Embedded',
  ]);
}
