import type ts from 'typescript';
import { AbstractCompilationMessage } from 'packages/core/src/compilation-context/messages/AbstractCompilationMessage';
import { DecoratorValidator } from './DecoratorValidator';
import { DecoratorParent } from '../../../api/decorators/DecoratorParent';
import { DecoratorTarget } from '../../../api/decorators/DecoratorTarget';
import { Decorator } from '../../../api/decorators/Decorator';
import { DecoratorError } from '../../../compilation-context/messages/errors/DecoratorError';

export class ParentDecoratorValidator implements DecoratorValidator {
  validate(
    decorator: Decorator,
    decoratorNode: ts.Decorator,
    otherDecoratorNodes: ts.Decorator[],
    decoratorParent: DecoratorParent | null,
    decoratorTarget: DecoratorTarget
  ): AbstractCompilationMessage[] {
    if (decoratorParent !== null && !decorator.parents.includes(decoratorParent)) {
      const expectedParents = decorator.parents.join(', ');
      return [
        new DecoratorError(
          `@${decorator.name} from '${decorator.moduleName}' can not be used inside ${decoratorParent}, expected to be used inside: ${expectedParents}.`,
          decoratorNode,
          null,
          null,
        )
      ];
    }

    return [];
  }
}
