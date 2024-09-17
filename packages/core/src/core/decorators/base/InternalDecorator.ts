import { DecoratorParent } from '../../../api/decorators/DecoratorParent';
import { DecoratorTarget } from '../../../api/decorators/DecoratorTarget';
import { BaseCustomDecorator } from './BaseCustomDecorator';
import { ClawjectDecoratorArgumentError, DecoratorArgument, DecoratorArgumentConstraint } from '../../../api/decorators/DecoratorArgumentConstraint';

export class InternalDecorator extends BaseCustomDecorator {
  name = 'Internal';
  uniq = true;
  parents = [
    DecoratorParent.ConfigurationClass,
    DecoratorParent.ApplicationClass,
  ];
  targets = [
    DecoratorTarget.Bean,
    DecoratorTarget.ConfigurationClass,
    DecoratorTarget.ApplicationClass,
    DecoratorTarget.Import,
  ];
  argumentConstraints: DecoratorArgumentConstraint[] = [
    {optional: true, staticallyKnown: true}
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

  protected compatibleDecorators = new Set([
    'Bean',
    'Factory',
    'Configuration',
    'Embedded',
    'Lazy',
    'Scope',
    'Primary',
    'Qualifier',
    'ClawjectApplication',
  ]);
}
