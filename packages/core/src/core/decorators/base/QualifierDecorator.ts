import { DecoratorParent } from '../../../api/decorators/DecoratorParent';
import { DecoratorTarget } from '../../../api/decorators/DecoratorTarget';
import { BaseCustomDecorator } from './BaseCustomDecorator';
import { ClawjectDecoratorArgumentError, DecoratorArgument, DecoratorArgumentConstraint } from '../../../api/decorators/DecoratorArgumentConstraint';

export class QualifierDecorator extends BaseCustomDecorator {
  name = 'Qualifier';
  uniq = true;
  parents = [
    DecoratorParent.ConfigurationClass,
    DecoratorParent.ApplicationClass,
  ];
  targets = [
    DecoratorTarget.Bean,
  ];
  argumentConstraints: DecoratorArgumentConstraint[] = [
    { optional: false, staticallyKnown: true }
  ];

  validateArguments(args: DecoratorArgument[]): ClawjectDecoratorArgumentError[] {
    const zeroArgument = args[0];

    if (typeof zeroArgument.value !== 'string') {
      return [
        {
          index: 0,
          error: 'Should be a string',
        }
      ];
    }

    if (zeroArgument.value.length === 0) {
      return [
        {
          index: 0,
          error: 'Should not be empty string',
        }
      ];
    }

    return [];
  }

  protected compatibleDecorators= new Set([
    'Bean',
    'Embedded',
    'Lazy',
    'Scope',
    'Primary',
    'Internal',
    'External',
  ]);
}
