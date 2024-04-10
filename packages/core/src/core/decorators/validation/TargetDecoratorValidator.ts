import type ts from 'typescript';
import { AbstractCompilationMessage } from 'packages/core/src/compilation-context/messages/AbstractCompilationMessage';
import { DecoratorValidator } from './DecoratorValidator';
import { DecoratorParent } from '../../../api/decorators/DecoratorParent';
import { DecoratorTarget } from '../../../api/decorators/DecoratorTarget';
import { Decorator } from '../../../api/decorators/Decorator';
import { DecoratorError } from '../../../compilation-context/messages/errors/DecoratorError';

export class TargetDecoratorValidator implements DecoratorValidator {
  validate(
    decorator: Decorator,
    decoratorNode: ts.Decorator,
    otherDecoratorNodes: ts.Decorator[],
    decoratorParent: DecoratorParent | null,
    decoratorTarget: DecoratorTarget
  ): AbstractCompilationMessage[] {
    if (!decorator.targets.includes(decoratorTarget)) {
      const expectedTargets = Array.from(decorator.targets).join(', ');
      return [
        new DecoratorError(
          `@${decorator.name} from '${decorator.moduleName}' can not be used on ${decoratorTarget}, expected to be used on: ${expectedTargets}.`,
          decoratorNode,
          null,
          null,
        )
      ];
    }

    return [];
  }
}
