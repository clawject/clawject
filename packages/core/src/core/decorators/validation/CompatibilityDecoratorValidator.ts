import type ts from 'typescript';
import { AbstractCompilationMessage } from 'packages/core/src/compilation-context/messages/AbstractCompilationMessage';
import { DecoratorValidator } from './DecoratorValidator';
import { DecoratorParent } from '../../../api/decorators/DecoratorParent';
import { DecoratorTarget } from '../../../api/decorators/DecoratorTarget';
import { Decorator } from '../../../api/decorators/Decorator';
import { DecoratorProcessor } from '../DecoratorProcessor';
import { DecoratorError } from '../../../compilation-context/messages/errors/DecoratorError';

export class CompatibilityDecoratorValidator implements DecoratorValidator {
  validate(
    decorator: Decorator,
    decoratorNode: ts.Decorator,
    otherDecoratorNodes: ts.Decorator[],
    decoratorParent: DecoratorParent | null,
    decoratorTarget: DecoratorTarget
  ): AbstractCompilationMessage[] {
    const errors: AbstractCompilationMessage[] = [];

    otherDecoratorNodes.forEach(otherDecoratorNode => {
      const otherDecorator = DecoratorProcessor.getDecoratorByModifier(otherDecoratorNode);
      if (!otherDecorator) {
        return;
      }

      const isCompatible = decorator.isCompatibleWith(otherDecorator);

      if (isCompatible === null) {
        return;
      }

      if (!isCompatible) {
        errors.push(new DecoratorError(
          `@${decorator.name} from '${decorator.moduleName}' can not be used with @${otherDecorator.name} from '${otherDecorator.moduleName}'.`,
          decoratorNode,
          null,
          null,
        ));
      }
    });

    return errors;
  }
}
