import { DecoratorParent } from '../../../api/decorators/DecoratorParent';
import { DecoratorTarget } from '../../../api/decorators/DecoratorTarget';
import { BaseCustomDecorator } from './BaseCustomDecorator';
import { ClawjectDecoratorArgumentError, DecoratorArgumentConstraint } from '../../../api/decorators/DecoratorArgumentConstraint';

export class ScopeDecorator extends BaseCustomDecorator {
  name = 'Scope';
  uniq = true;
  parents = [
    DecoratorParent.ConfigurationClass,
    DecoratorParent.ApplicationClass,
  ];
  targets = [
    DecoratorTarget.Bean,
    DecoratorTarget.ConfigurationClass,
    DecoratorTarget.ApplicationClass,
  ];
  argumentConstraints: DecoratorArgumentConstraint[] = [
    { optional: false, staticallyKnown: false }
  ];

  validateArguments(): ClawjectDecoratorArgumentError[] {
    return [];
  }

  protected compatibleDecorators= new Set([
    'Bean',
    'Configuration',
    'Embedded',
    'Lazy',
    'Primary',
    'Qualifier',
    'ClawjectApplication',
    'Internal',
    'External',
  ]);
}
