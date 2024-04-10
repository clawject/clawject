import { DecoratorParent } from '../../../api/decorators/DecoratorParent';
import { DecoratorTarget } from '../../../api/decorators/DecoratorTarget';
import { BaseCustomDecorator } from './BaseCustomDecorator';
import { ClawjectDecoratorArgumentError, DecoratorArgument, DecoratorArgumentConstraint } from '../../../api/decorators/DecoratorArgumentConstraint';

export class LazyDecorator extends BaseCustomDecorator {
  name = 'Lazy';
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
    { optional: true, staticallyKnown: false }
  ];

  validateArguments(args: DecoratorArgument[]): ClawjectDecoratorArgumentError[] {
    const zeroArgument = args[0];

    if (typeof zeroArgument.value === 'boolean' || zeroArgument.value === undefined) {
      return [];
    }

    return [
      {
        index: 0,
        error: 'Should be boolean or undefined',
      }
    ];
  }

  protected compatibleDecorators= new Set([
    'Bean',
    'Configuration',
    'Embedded',
    'Scope',
    'Primary',
    'Qualifier',
    'ClawjectApplication',
    'Internal',
    'External',
  ]);
}
