import type ts from 'typescript';
import { AbstractCompilationMessage } from 'packages/core/src/compilation-context/messages/AbstractCompilationMessage';
import { DecoratorValidator } from './DecoratorValidator';
import { DecoratorParent } from '../../../api/decorators/DecoratorParent';
import { DecoratorTarget } from '../../../api/decorators/DecoratorTarget';
import { Decorator } from '../../../api/decorators/Decorator';
import { DecoratorProcessor } from '../DecoratorProcessor';
import { DecoratorError } from '../../../compilation-context/messages/errors/DecoratorError';

export class UniquenessDecoratorValidator implements DecoratorValidator {
  validate(
    decorator: Decorator,
    decoratorNode: ts.Decorator,
    otherDecoratorNodes: ts.Decorator[],
    decoratorParent: DecoratorParent | null,
    decoratorTarget: DecoratorTarget
  ): AbstractCompilationMessage[] {
    const errors: AbstractCompilationMessage[] = [];

    if (!decorator.uniq) {
      return errors;
    }

    for (const otherDecoratorNode of otherDecoratorNodes) {
      const otherDecorator = DecoratorProcessor.getDecoratorByModifier(otherDecoratorNode);
      if (decorator === otherDecorator) {
        return [
          new DecoratorError(
            `@${decorator.name} from '${decorator.moduleName}' can not be used multiple times.`,
            decoratorNode,
            null,
            null,
          )
        ];
      }
    }

    return errors;
  }
}
