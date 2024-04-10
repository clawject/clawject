import { DecoratorParent } from '../../../api/decorators/DecoratorParent';
import { DecoratorTarget } from '../../../api/decorators/DecoratorTarget';
import { BaseCustomDecorator } from './BaseCustomDecorator';
import { ClawjectDecoratorArgumentError, DecoratorArgumentConstraint } from '../../../api/decorators/DecoratorArgumentConstraint';

export class PrimaryDecorator extends BaseCustomDecorator {
  name = 'Primary';
  uniq = true;
  parents = [
    DecoratorParent.ConfigurationClass,
    DecoratorParent.ApplicationClass,
  ];
  targets = [
    DecoratorTarget.Bean,
  ];
  argumentConstraints: DecoratorArgumentConstraint[] = [];

  validateArguments(): ClawjectDecoratorArgumentError[] {
    return [];
  }

  protected compatibleDecorators= new Set([
    'Bean',
    'Embedded',
    'Lazy',
    'Scope',
    'Qualifier',
    'Internal',
    'External',
  ]);
}
